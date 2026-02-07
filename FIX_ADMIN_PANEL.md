# 🔧 Fix Admin Panel - Step by Step Commands

## Problem: Admin panel not loading on http://72.62.195.222

## Solution: Configure Nginx properly

---

## Step 1: Check if Admin is Built

```bash
cd /var/www/Baby-Pearl/admin-panel
ls -la dist/
```

**If dist/ folder is empty or missing, build it:**
```bash
npm run build
```

---

## Step 2: Create Correct Nginx Config

```bash
cd /var/www/Baby-Pearl
nano nginx-simple.conf
```

**Paste this content:**

```nginx
# Simple Nginx Config for Baby Photo Prompt

# Default server - serves admin panel
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/Baby-Pearl/admin-panel/dist;
    index index.html;
    
    server_name _;
    
    # Admin panel
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:8004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    }
}

# Backend API on port 8004 (already running via PM2)
# No need to configure here, it's accessible directly
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

---

## Step 3: Apply Nginx Config

```bash
# Remove old config
sudo rm /etc/nginx/sites-enabled/default
sudo rm /etc/nginx/sites-enabled/baby-photo-prompt

# Copy new config
sudo cp nginx-simple.conf /etc/nginx/sites-available/baby-photo-prompt

# Enable new config
sudo ln -s /etc/nginx/sites-available/baby-photo-prompt /etc/nginx/sites-enabled/

# Test config
sudo nginx -t
```

**Expected:** `syntax is ok` and `test is successful`

---

## Step 4: Reload Nginx

```bash
sudo systemctl reload nginx
```

---

## Step 5: Verify

```bash
# Check Nginx status
sudo systemctl status nginx

# Check if admin files exist
ls -la /var/www/Baby-Pearl/admin-panel/dist/

# Test in browser
# Open: http://72.62.195.222
```

---

## Alternative: Quick Fix Commands (Copy-Paste All)

```bash
# Navigate to project
cd /var/www/Baby-Pearl

# Build admin panel
cd admin-panel
npm run build
cd ..

# Create simple nginx config
cat > /tmp/nginx-baby.conf << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/Baby-Pearl/admin-panel/dist;
    index index.html;
    
    server_name _;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8004;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header 'Access-Control-Allow-Origin' '*' always;
    }
}
EOF

# Apply config
sudo rm -f /etc/nginx/sites-enabled/default
sudo rm -f /etc/nginx/sites-enabled/baby-photo-prompt
sudo cp /tmp/nginx-baby.conf /etc/nginx/sites-available/baby-photo-prompt
sudo ln -s /etc/nginx/sites-available/baby-photo-prompt /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Check status
echo "=== Nginx Status ==="
sudo systemctl status nginx --no-pager | head -10
echo ""
echo "=== Admin Files ==="
ls -la /var/www/Baby-Pearl/admin-panel/dist/ | head -10
echo ""
echo "Now open: http://72.62.195.222"
```

---

## Troubleshooting

### If admin still not loading:

**Check 1: Is dist/ folder populated?**
```bash
ls -la /var/www/Baby-Pearl/admin-panel/dist/
```

**Should see:** index.html, assets/, etc.

**If empty:**
```bash
cd /var/www/Baby-Pearl/admin-panel
npm run build
```

---

**Check 2: Nginx errors**
```bash
sudo tail -f /var/log/nginx/error.log
```

---

**Check 3: Permissions**
```bash
sudo chmod -R 755 /var/www/Baby-Pearl/admin-panel/dist/
```

---

**Check 4: Nginx test**
```bash
sudo nginx -t
```

---

## Expected Result

**After running commands:**
- Open browser: `http://72.62.195.222`
- Admin panel should load ✅
- Backend API: `http://72.62.195.222:8004/api/photos` ✅

---

**Run the "Quick Fix Commands" section - copy paste all at once!** 🚀
