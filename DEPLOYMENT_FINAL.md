# 🚀 VPS Deployment Guide - Port 8004 + Domain Setup

## ✅ Configuration Summary

- **Backend Port**: `8004`
- **Admin Panel**: Domain-based (Nginx reverse proxy)
- **Backend API Domain**: `api.yourdomain.com`
- **Admin Panel Domain**: `admin.yourdomain.com`

---

## 📋 Prerequisites

1. VPS with root access
2. Domain name with DNS configured
3. Node.js installed
4. PM2 installed (`npm install -g pm2`)
5. Nginx installed (`sudo apt install nginx`)

---

## 🌐 Step 1: DNS Configuration

Point your domains to VPS IP:

```
A Record:  api.yourdomain.com     →  YOUR_VPS_IP
A Record:  admin.yourdomain.com   →  YOUR_VPS_IP
```

Wait 5-10 minutes for DNS propagation.

---

## 📂 Step 2: Upload Project to VPS

### Option A: Using Git (Recommended)
```bash
cd /var/www
git clone YOUR_REPO_URL baby-photo-prompt
cd baby-photo-prompt
```

### Option B: Using SCP/SFTP
```bash
# From your local machine
scp -r "d:/MY PROJECT/Baby Photo Prompt" root@YOUR_VPS_IP:/var/www/baby-photo-prompt
```

---

## 🔧 Step 3: Backend Setup (Port 8004)

```bash
cd /var/www/baby-photo-prompt/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
```

**Add to .env:**
```env
PORT=8004
MONGODB_URI=mongodb://localhost:27017/baby-photo-prompts
NODE_ENV=production
```

**Start with PM2:**
```bash
pm2 start server.js --name baby-photo-backend
pm2 save
pm2 startup  # Enable auto-start on boot
```

**Verify:**
```bash
pm2 list
curl http://localhost:8004/api/photos
```

---

## 🎨 Step 4: Admin Panel Setup

```bash
cd /var/www/baby-photo-prompt/admin-panel

# Update .env.production with your domain
nano .env.production
```

**Add to .env.production:**
```env
VITE_API_URL=https://api.yourdomain.com
```

**Build:**
```bash
npm install
npm run build
```

Build folder will be created at: `/var/www/baby-photo-prompt/admin-panel/dist`

---

## 🌐 Step 5: Nginx Configuration

**Edit nginx.conf file:**
```bash
cd /var/www/baby-photo-prompt
nano nginx.conf
```

**Replace these lines:**
```nginx
server_name api.yourdomain.com;     # Line 6
server_name admin.yourdomain.com;   # Line 31
```

**Copy to Nginx:**
```bash
sudo cp nginx.conf /etc/nginx/sites-available/baby-photo-prompt
sudo ln -s /etc/nginx/sites-available/baby-photo-prompt /etc/nginx/sites-enabled/
```

**Test and reload:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 Step 6: SSL Certificate (Free with Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com -d admin.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS (option 2)
```

**Auto-renewal test:**
```bash
sudo certbot renew --dry-run
```

---

## 📱 Step 7: Update Mobile App

**File**: `mobile-app/utils/config.ts`

```typescript
export const API_URL = 'https://api.yourdomain.com/api';
```

Then rebuild your mobile app.

---

## ✅ Step 8: Verify Deployment

### Test Backend:
```bash
curl https://api.yourdomain.com/api/photos
```

### Test Admin Panel:
Open browser: `https://admin.yourdomain.com`

### Check PM2:
```bash
pm2 list
pm2 logs baby-photo-backend
```

### Check Nginx:
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

---

## 🔥 Quick Deploy Script

Make script executable:
```bash
chmod +x /var/www/baby-photo-prompt/deploy.sh
```

Run deployment:
```bash
cd /var/www/baby-photo-prompt
./deploy.sh
```

---

## 📊 Useful Commands

### PM2 Management:
```bash
pm2 list                          # List all apps
pm2 logs baby-photo-backend       # View logs
pm2 restart baby-photo-backend    # Restart
pm2 stop baby-photo-backend       # Stop
pm2 delete baby-photo-backend     # Delete
pm2 monit                         # Monitor
```

### Nginx Management:
```bash
sudo systemctl status nginx       # Status
sudo systemctl restart nginx      # Restart
sudo nginx -t                     # Test config
sudo tail -f /var/log/nginx/error.log  # Error logs
```

### Check Port:
```bash
sudo netstat -tulpn | grep 8004   # Check if 8004 is listening
sudo lsof -i :8004                # See what's using port 8004
```

---

## 🔧 Troubleshooting

### Backend not starting:
```bash
pm2 logs baby-photo-backend --lines 50
# Check for MongoDB connection errors
```

### Admin panel 404:
```bash
# Check if build folder exists
ls -la /var/www/baby-photo-prompt/admin-panel/dist
# Rebuild if needed
cd /var/www/baby-photo-prompt/admin-panel && npm run build
```

### Nginx errors:
```bash
sudo nginx -t  # Test configuration
sudo tail -f /var/log/nginx/error.log  # Check errors
```

### Port 8004 already in use:
```bash
sudo lsof -i :8004
sudo kill -9 <PID>
```

### SSL certificate issues:
```bash
sudo certbot certificates  # List certificates
sudo certbot renew        # Renew manually
```

---

## 🎯 Final URLs

After successful deployment:

- **Backend API**: `https://api.yourdomain.com`
- **Admin Panel**: `https://admin.yourdomain.com`
- **Mobile App**: Update config to use `https://api.yourdomain.com/api`

---

## 📝 Maintenance

### Update Backend:
```bash
cd /var/www/baby-photo-prompt/backend
git pull  # If using git
npm install
pm2 restart baby-photo-backend
```

### Update Admin:
```bash
cd /var/www/baby-photo-prompt/admin-panel
git pull  # If using git
npm install
npm run build
# Nginx will serve new build automatically
```

---

## 🔐 Security Checklist

- [ ] SSL certificate installed
- [ ] Firewall configured (allow 80, 443, 8004)
- [ ] MongoDB secured (authentication enabled)
- [ ] .env files not in git repository
- [ ] Regular backups configured
- [ ] PM2 auto-restart enabled
- [ ] Nginx security headers added

---

## 📞 Support

**Email**: pearlproduction9@gmail.com

---

**Happy Deploying! 🚀**
