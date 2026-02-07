# VPS Deployment Guide - Baby AI Photo Prompt

## 🔍 Step 1: Check Running Ports on VPS

SSH into your VPS and run these commands:

```bash
# Check all listening ports
sudo netstat -tulpn | grep LISTEN

# OR use ss command (modern alternative)
sudo ss -tulpn | grep LISTEN

# Check specific port (example: 3000)
sudo lsof -i :3000

# Check all Node.js processes
ps aux | grep node

# Check PM2 processes (if using PM2)
pm2 list
```

### Common Ports to Check:
- **3000** - Usually Node.js apps
- **5000** - Backend APIs
- **5173** - Vite dev server
- **80** - HTTP
- **443** - HTTPS
- **3001, 3002** - Other Node apps

---

## 📦 Step 2: Choose Available Ports

Based on what's running, choose free ports:

### Recommended Port Setup:
- **Backend API**: `5001` (if 5000 is taken)
- **Admin Panel**: `5174` (if 5173 is taken)

---

## 🚀 Step 3: Backend Deployment

### A. Update Backend Port (if needed)

**File**: `backend/server.js`

```javascript
const PORT = process.env.PORT || 5001; // Change to available port
```

### B. Create Production .env

**File**: `backend/.env`

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
```

### C. Install Dependencies

```bash
cd /path/to/backend
npm install
```

### D. Start Backend with PM2

```bash
# Install PM2 globally (if not installed)
npm install -g pm2

# Start backend
pm2 start server.js --name baby-photo-backend

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

---

## 🎨 Step 4: Admin Panel Deployment

### A. Update API URL

**File**: `admin-panel/src/components/Dashboard.jsx` (and all API calls)

Find and replace:
```javascript
// OLD
axios.get('http://localhost:5000/api/photos')

// NEW
axios.get('http://YOUR_VPS_IP:5001/api/photos')
// OR with domain
axios.get('https://api.yourdomain.com/api/photos')
```

**Better approach - Create config file:**

**File**: `admin-panel/src/config.js`

```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://YOUR_VPS_IP:5001';
```

**File**: `admin-panel/.env.production`

```env
VITE_API_URL=http://YOUR_VPS_IP:5001
```

### B. Build Admin Panel

```bash
cd /path/to/admin-panel
npm install
npm run build
```

### C. Serve with PM2 (using serve package)

```bash
# Install serve globally
npm install -g serve

# Serve the build folder
pm2 serve dist 5174 --name baby-photo-admin --spa

# Save PM2 process
pm2 save
```

---

## 🌐 Step 5: Nginx Configuration (Recommended)

Instead of exposing ports, use Nginx reverse proxy:

**File**: `/etc/nginx/sites-available/baby-photo-prompt`

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin Panel
server {
    listen 80;
    server_name admin.yourdomain.com;

    root /path/to/admin-panel/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5001;
    }
}
```

**Enable site:**

```bash
sudo ln -s /etc/nginx/sites-available/baby-photo-prompt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📱 Step 6: Update Mobile App API URL

**File**: `mobile-app/utils/config.ts`

```typescript
export const API_URL = 'http://YOUR_VPS_IP:5001/api';
// OR with domain
export const API_URL = 'https://api.yourdomain.com/api';
```

---

## 🔒 Step 7: SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com -d admin.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 📊 Step 8: Monitor & Manage

### PM2 Commands:

```bash
# List all processes
pm2 list

# View logs
pm2 logs baby-photo-backend
pm2 logs baby-photo-admin

# Restart
pm2 restart baby-photo-backend
pm2 restart baby-photo-admin

# Stop
pm2 stop baby-photo-backend

# Delete
pm2 delete baby-photo-backend

# Monitor
pm2 monit
```

---

## 🎯 Quick Deployment Script

**File**: `deploy.sh`

```bash
#!/bin/bash

echo "🚀 Deploying Baby AI Photo Prompt..."

# Backend
echo "📦 Deploying Backend..."
cd /path/to/backend
git pull
npm install
pm2 restart baby-photo-backend

# Admin Panel
echo "🎨 Deploying Admin Panel..."
cd /path/to/admin-panel
git pull
npm install
npm run build
pm2 restart baby-photo-admin

echo "✅ Deployment Complete!"
pm2 list
```

Make executable:
```bash
chmod +x deploy.sh
```

---

## 🔍 Troubleshooting

### Port Already in Use:

```bash
# Find process using port 5001
sudo lsof -i :5001

# Kill process
sudo kill -9 <PID>
```

### Check Firewall:

```bash
# Allow port
sudo ufw allow 5001
sudo ufw allow 5174

# Check status
sudo ufw status
```

### Check Logs:

```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 📝 Final Checklist

- [ ] Check available ports on VPS
- [ ] Update backend port if needed
- [ ] Configure MongoDB connection
- [ ] Deploy backend with PM2
- [ ] Build admin panel
- [ ] Serve admin panel
- [ ] Configure Nginx (optional)
- [ ] Update mobile app API URL
- [ ] Test all endpoints
- [ ] Setup SSL (recommended)
- [ ] Configure auto-restart on boot

---

## 🌐 Access URLs

After deployment:

- **Backend API**: `http://YOUR_VPS_IP:5001`
- **Admin Panel**: `http://YOUR_VPS_IP:5174`

With Nginx + Domain:
- **Backend API**: `https://api.yourdomain.com`
- **Admin Panel**: `https://admin.yourdomain.com`

---

## 💡 Pro Tips

1. **Use Environment Variables**: Never hardcode URLs
2. **Use PM2**: Better than `node server.js`
3. **Use Nginx**: Reverse proxy is more secure
4. **Use SSL**: Free with Let's Encrypt
5. **Monitor Logs**: `pm2 logs` is your friend
6. **Backup Database**: Regular MongoDB backups
7. **Use Git**: Deploy from repository

---

**Need Help?** Contact: pearlproduction9@gmail.com
