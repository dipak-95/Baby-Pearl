# 🔧 Fix Admin Panel - Correct Folder Name: Baby-pearl

## Problem: Incorrect folder path in Nginx config
## Solution: Update Nginx config with "Baby-pearl"

---

## 🚀 Correct Commands (Copy & Paste All):

```bash
# 1. Navigate to correct folder
cd /var/www/Baby-pearl/admin-panel

# 2. Build Admin Panel
npm install && npm run build

# 3. Create Nginx Config with CORRECT PATH
sudo bash -c 'cat > /etc/nginx/sites-available/baby-photo-prompt << "EOF"
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    # CORRECT PATH: Baby-pearl (small p)
    root /var/www/Baby-pearl/admin-panel/dist;
    index index.html;
    
    server_name _;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://127.0.0.1:8004/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF'

# 4. Fix Permissions
sudo chmod -R 755 /var/www/Baby-pearl/admin-panel/dist
sudo chown -R www-data:www-data /var/www/Baby-pearl/admin-panel/dist

# 5. Apply & Reload
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/baby-photo-prompt /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "✅ FIXED! Open Browser: http://72.62.195.222"
```

---

## 🔍 Verification Commands:

```bash
# Check if dist files exist in correct folder
ls -la /var/www/Baby-pearl/admin-panel/dist/

# Check Nginx status
sudo systemctl status nginx
```

---

## 📝 Key Changes:

- Changed `Baby-Pearl` → `Baby-pearl` (small p)
- Updated valid Nginx root path
- Re-ran build to ensure files exist

---

**Run the commands above and refresh browser!** 🚀
