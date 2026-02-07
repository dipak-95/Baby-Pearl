# 🔴 Fix 500 Internal Server Error

## Problem: Nginx showing 500 error

## Quick Fix Commands:

---

## Step 1: Check Nginx Error Logs

```bash
sudo tail -f /var/log/nginx/error.log
```

**Press Ctrl+C to stop after reading**

---

## Step 2: Check if Admin Panel is Built

```bash
ls -la /var/www/Baby-Pearl/admin-panel/dist/
```

**Should show:** index.html, assets/, etc.

**If empty or missing:**
```bash
cd /var/www/Baby-Pearl/admin-panel
npm run build
```

---

## Step 3: Fix Permissions

```bash
sudo chmod -R 755 /var/www/Baby-Pearl/admin-panel/dist/
sudo chown -R www-data:www-data /var/www/Baby-Pearl/admin-panel/dist/
```

---

## Step 4: Create Working Nginx Config

```bash
sudo nano /etc/nginx/sites-available/baby-photo-prompt
```

**Delete everything and paste this:**

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/Baby-Pearl/admin-panel/dist;
    index index.html;
    
    server_name _;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://127.0.0.1:8004/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Save:** `Ctrl+X`, `Y`, `Enter`

---

## Step 5: Test and Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Alternative: Complete Reset (If above doesn't work)

```bash
# Stop nginx
sudo systemctl stop nginx

# Remove all configs
sudo rm -f /etc/nginx/sites-enabled/*

# Build admin
cd /var/www/Baby-Pearl/admin-panel
npm run build

# Create fresh config
sudo bash -c 'cat > /etc/nginx/sites-available/baby-photo-prompt << "EOF"
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/Baby-Pearl/admin-panel/dist;
    index index.html;
    
    server_name _;
    
    location / {
        try_files $uri $uri/ /index.html =404;
    }
    
    location /api/ {
        proxy_pass http://127.0.0.1:8004/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
EOF'

# Enable config
sudo ln -s /etc/nginx/sites-available/baby-photo-prompt /etc/nginx/sites-enabled/

# Fix permissions
sudo chmod -R 755 /var/www/Baby-Pearl/admin-panel/dist/
sudo chown -R www-data:www-data /var/www/Baby-Pearl/admin-panel/dist/

# Test and start
sudo nginx -t
sudo systemctl start nginx
sudo systemctl status nginx
```

---

## Debugging Steps:

### Check 1: Admin files exist?
```bash
ls -la /var/www/Baby-Pearl/admin-panel/dist/index.html
```

**Should show:** index.html file

### Check 2: Nginx error logs
```bash
sudo tail -20 /var/log/nginx/error.log
```

### Check 3: Nginx config test
```bash
sudo nginx -t
```

### Check 4: Permissions
```bash
ls -la /var/www/Baby-Pearl/admin-panel/
```

**dist/ should be readable**

---

## Quick One-Command Fix:

**Copy-paste this entire block:**

```bash
cd /var/www/Baby-Pearl/admin-panel && \
npm run build && \
sudo chmod -R 755 dist/ && \
sudo chown -R www-data:www-data dist/ && \
sudo bash -c 'cat > /etc/nginx/sites-available/baby-photo-prompt << "EOF"
server {
    listen 80 default_server;
    root /var/www/Baby-Pearl/admin-panel/dist;
    index index.html;
    server_name _;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://127.0.0.1:8004/api/;
    }
}
EOF' && \
sudo rm -f /etc/nginx/sites-enabled/default && \
sudo ln -sf /etc/nginx/sites-available/baby-photo-prompt /etc/nginx/sites-enabled/ && \
sudo nginx -t && \
sudo systemctl reload nginx && \
echo "✅ Done! Refresh browser: http://72.62.195.222"
```

---

**Run the one-command fix and refresh browser!** 🚀
