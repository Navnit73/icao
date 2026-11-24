# Deploying a Next.js app to the shared VPS (guide for Claude)

> Paste this file into the other project and say: "deploy this project on the VPS following DEPLOY.md".
> Reference implementation: https://github.com/Navnit73/pixpassport.uk (public). Copy its files, don't reinvent them.

## 0. Rules for the assistant

- **Several apps share this one VPS.** Never wipe it, never touch other apps, other nginx vhosts, `/etc/letsencrypt`, the firewall, or the `deploy` user's other pm2 processes.
- **Never write passwords or private keys into the repo, files, commits or logs.** The user will paste the root SSH password in chat when needed. Use it only for the session (see section 6).
- Before anything destructive on the server (rm, pm2 delete, overwriting nginx/env files) look at the target first and back up env files to `/root/backup-<app>/`.
- Ask the user for: **app name**, **domain**, and whether the repo is public (public = plain HTTPS clone works).
- Verify at the end. Don't report "done" from a successful build alone.

## 1. The server

| Item | Value |
|---|---|
| IP | `36.50.82.106` |
| OS | Ubuntu 24.04, 8 GB RAM, nginx, certbot, ufw (22/80/443 open), fail2ban |
| App user | `deploy` (owns all apps; Node via nvm, default Node 22; pm2 7.x) |
| App dir | `/home/deploy/apps/<app>` (one git checkout per app) |
| Process manager | pm2 **as the `deploy` user**, `pm2 save` + systemd unit `pm2-deploy` already enabled |
| Web server | nginx, **one file per site** in `/etc/nginx/sites-available/<domain>`, symlinked into `sites-enabled/` |
| Catch-all | `sites-available/default` returns 444 for unknown hosts (so every app needs its own vhost) |
| TLS | Let's Encrypt via certbot, certs in `/etc/letsencrypt/live/<domain>/` |
| DNS/CDN | Cloudflare, records **proxied** |
| Old stuff to leave alone | `/opt/fastapi` (user `fastapi`) |

### Port registry (one port per app, bound to 127.0.0.1 via nginx only)

Pick the next free port and **check it is free** first: `ss -tlnp | grep :<port>`.

| Port | App |
|---|---|
| 3007 | pixpassport.uk (`pixpassport-uk`) |
| 3008 | idphoto.us (`idphoto-us`) |
| 3009 | id-photo-maker.com (`id-photo-maker`) — this repo |
| 3010+ | next apps. Add a row here when you take one. |

## 2. Files to add to the app repo

Copy from the reference repo (raw GitHub URLs below), then rename:

```
https://raw.githubusercontent.com/Navnit73/pixpassport.uk/main/scripts/deploy.sh
https://raw.githubusercontent.com/Navnit73/pixpassport.uk/main/ecosystem.config.cjs
https://raw.githubusercontent.com/Navnit73/pixpassport.uk/main/.github/workflows/deploy.yml
```

| File | What to change |
|---|---|
| `scripts/deploy.sh` | `APP_NAME` (pm2 name), default `APP_DIR` (`$HOME/apps/<app>`), default `APP_PORT`, `LOCK_FILE` name derives from `APP_NAME` |
| `ecosystem.config.cjs` | `name`, `args: "start -p <PORT>"`, `env.PORT` |
| `.github/workflows/deploy.yml` | `concurrency.group` (unique per app), `cd ~/apps/<app>`, temp script filename, Node version if the app needs another, drop `npm run lint` / `tsc` steps the app doesn't have |

Check the app first:
- `package.json` has `build` and `start` scripts; Next.js is a dependency (the ecosystem runs `node_modules/next/dist/bin/next start`).
- Low-RAM builds: if `npm run build` is heavy, keep `next.config` memory options. The VPS has 8 GB shared across apps; build apps one at a time.
- If the project has `.env`/`.env.local` locally, it needs the same variables in `.env.production` on the server (next section).

`deploy.sh` behaviour (don't weaken it): lock against concurrent deploys, `git reset --hard origin/main`, back up `.next`, `npm ci`, `npm run build`, verify `.next/BUILD_ID`, `pm2 startOrReload`, health-check the port for ~40 s, **auto-rollback** to the previous commit and `.next` on any failure.

Commit and push these files **after** the first manual deploy (section 5) so the first CI run doesn't fail on a missing checkout.

## 3. Environment variables

- Production env lives only on the server: `/home/deploy/apps/<app>/.env.production`, mode `600`, owner `deploy`. It is never committed. The deploy does not touch it.
- Build it from the local `.env.local`/`.env`. **Check every line is `KEY=value`**: we once had `MONGODB_URI=MONGODB_URI=mongodb+srv://...` (doubled key) which broke the app. Inspect keys with `cut -d= -f1`, don't print secrets into the chat.
- `NEXT_PUBLIC_*` values are baked in at **build** time, so they must exist before `npm run build`.
- After changing env on a running app: `pm2 restart <name> --update-env`.
- If the app uses a shared MongoDB database, creating indexes with a name that already exists with different options throws error 85/86. Match existing indexes or catch those codes.

## 4. DNS and TLS

1. **Cloudflare DNS** (user does this, or give them exact records): `A <domain> -> 36.50.82.106` (proxied) and `A www -> 36.50.82.106` (proxied). **Delete any old Vercel A/CNAME records** for the same names (`216.198.79.1`, `64.29.17.1`, `_domainconnect...vercel-dns.com`), otherwise the domain keeps resolving to Vercel. Verify with `dig +short NS <domain>` and `dig +short A <domain> @1.1.1.1`.
2. Cloudflare **SSL/TLS mode = Full (strict)**.
3. Certificate on the server (root):
   ```bash
   certbot certonly --webroot -w /var/www/html -d <domain> -d www.<domain>
   ```
   This needs the HTTP vhost below to already serve `/.well-known/acme-challenge/` from `/var/www/html`. Create the vhost with only the port-80 block first, reload nginx, run certbot, then add the 443 block.

## 5. First deploy (manual, as root over SSH)

```bash
# 1. clone as deploy (public repo -> plain HTTPS; private -> use a read-only deploy key)
sudo -u deploy bash -lc 'mkdir -p ~/apps && git clone https://github.com/<owner>/<repo>.git ~/apps/<app>'

# 2. env file (from the user's local env; check keys first)
install -o deploy -g deploy -m 600 <prepared-env> /home/deploy/apps/<app>/.env.production

# 3. nginx vhost + reload (template below)
ln -sf /etc/nginx/sites-available/<domain> /etc/nginx/sites-enabled/<domain>
nginx -t && systemctl reload nginx

# 4. if scripts/deploy.sh and ecosystem.config.cjs are not pushed yet, copy them into the checkout, then:
sudo -u deploy bash -lc 'cd ~/apps/<app> && chmod +x scripts/deploy.sh && bash scripts/deploy.sh'

# 5. persist across reboot (pm2-deploy systemd unit is already enabled; just save)
sudo -u deploy bash -lc 'pm2 save'
```

### nginx vhost template (`/etc/nginx/sites-available/<domain>`)

This server's nginx is **older: it does not support `http2 on;`**. Use `listen 443 ssl http2;`.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name <domain> www.<domain>;
    location /.well-known/acme-challenge/ { root /var/www/html; }
    location / { return 301 https://<domain>$request_uri; }
}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name <domain> www.<domain>;

    ssl_certificate     /etc/letsencrypt/live/<domain>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<domain>/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    if ($host = www.<domain>) { return 301 https://<domain>$request_uri; }   # www -> non-www

    client_max_body_size 20m;
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:<PORT>;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
    }
}
```

Use the opposite redirect (non-www to www) only if the user asks for it.

## 6. Running commands on the VPS from the assistant's machine

There is no `sshpass`, and macOS has no `timeout`/`setsid`. Use an `SSH_ASKPASS` helper kept in the scratchpad (never in the repo), deleted afterwards:

```bash
# askpass.sh  ->  #!/bin/sh \n echo '<password the user pasted>'     (chmod 700)
SSH_ASKPASS=./askpass.sh SSH_ASKPASS_REQUIRE=force DISPLAY=x \
  ssh -o StrictHostKeyChecking=accept-new -o PubkeyAuthentication=no root@36.50.82.106 '<command>' < /dev/null
```

- Pass multi-line scripts as one quoted argument: `ssh ... "$(cat setup.sh)"`.
- Long commands (build) can exceed tool timeouts: run in background and read the output file.
- Don't run `pm2 startup` again; the `pm2-deploy` unit is already enabled.
- When finished, delete the askpass file and tell the user to change the root/deploy passwords (they were pasted in chat) and consider disabling SSH password login.

## 7. GitHub Actions CD

1. Repo secrets (Settings > Secrets and variables > Actions): `HOST` = `36.50.82.106`, `USERNAME` = `deploy`, `SSH_KEY` = private key whose public half is in `/home/deploy/.ssh/authorized_keys`.
2. Key choice: reuse the existing CI key (the user has it at `~/pixpassport-uk-github-actions-key.txt`) or make a new one:
   `sudo -u deploy ssh-keygen -t ed25519 -N "" -C github-actions-<app> -f /home/deploy/.ssh/gha_<app> && cat /home/deploy/.ssh/gha_<app>.pub >> /home/deploy/.ssh/authorized_keys`
3. `gh` may not be installed; if so the user adds secrets in the GitHub UI. Never paste the private key into chat or commits.
4. The workflow is: `verify` job (lint, typecheck, build on GitHub) then `deploy` job (SSH, run `scripts/deploy.sh` from the pushed commit). Add a `production` environment in repo settings (optional).
5. First push triggers a run; if secrets are missing the deploy job fails; add them and "Re-run jobs".

## 8. Verification checklist (do all, report results)

```bash
pm2 describe <name>                                   # online, restarts = 0
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:<PORT>/
curl -sk -o /dev/null -w '%{http_code} %{redirect_url}\n' --resolve www.<domain>:443:127.0.0.1 https://www.<domain>/x?y=1   # 301 to apex
curl -sI https://<domain>/ | head -5                  # public: expect the app, NOT "server: Vercel"
sudo -u deploy bash -lc 'pm2 logs <name> --lines 30 --nostream'   # no errors
nginx -t
```

If the public request still shows Vercel or a Cloudflare 52x error: DNS records (section 4) or SSL mode are wrong, not the server.

## 9. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `Invalid scheme, expected connection string to start with "mongodb://"` | Env line has the key twice, or quotes/blank value. Fix `.env.production`, `pm2 restart --update-env`. |
| `unknown directive "http2"` | Old nginx. Use `listen 443 ssl http2;`. |
| Mongo error: index name conflict (code 85/86) | Shared DB already has the index; match its options or catch the error. |
| 502 from nginx | App not running or wrong port. `pm2 logs`, compare `ecosystem` port with `proxy_pass`. |
| Deploy "Another deploy is already running" | A previous deploy holds the lock; wait, or check `ps` for a stuck build. |
| Deploy failed and rolled back | Read the build error in the Actions log; the previous version is still serving. |
| Domain shows a Vercel 404 | Old Vercel DNS records still in Cloudflare. |
| Build runs out of memory | Build one app at a time; keep Next memory options; consider adding swap. |
