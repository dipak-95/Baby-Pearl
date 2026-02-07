# 🚀 Baby AI Photo Prompt - VPS Deployment
## Domain: babyphotoadmin.online

---

## ✅ Configuration Summary

- **Domain**: `babyphotoadmin.online`
- **Backend API**: `api.babyphotoadmin.online` (Port 8004)
- **Admin Panel**: `babyphotoadmin.online`
- **Database**: MongoDB Atlas (Already configured)

---

## 📋 Step 1: DNS Configuration

Login to your domain registrar and add these DNS records:

```
Type: A Record
Name: @
Value: YOUR_VPS_IP
TTL: 3600

Type: A Record
Name: api
Value: YOUR_VPS_IP
TTL: 3600

Type: A Record
Name: www
Value: YOUR_VPS_IP
TTL: 3600
```

**Wait 5-10 minutes** for DNS propagation.

**Verify DNS:**
```bash
ping babyphotoadmin.online
ping api.babyphotoadmin.online
```

---

## 📂 Step 2: Upload Project to VPS

### Option A: Using SCP (From Windows)
```bash
scp -r "d:/MY PROJECT/Baby Photo Prompt" root@YOUR_VPS_IP:/var/www/baby-photo-prompt
```

### Option B: Using Git
```bash
# On VPS
cd /var/www
git clone YOUR_REPO_URL baby-photo-prompt
```

---

## 🚀 Step 3: Run Deployment Script

```bash
# SSH into VPS
ssh root@YOUR_VPS_IP

# Navigate to project
cd /var/www/baby-photo-prompt

# Make script executable
chmod +x deploy.sh

# Run deployment
sudo ./deploy.sh
```

The script will:
- ✅ Install backend dependencies
- ✅ Start backend on port 8004 with PM2
- ✅ Build admin panel
- ✅ Configure Nginx
- ✅ Setup SSL certificate (optional)

---

## 🔍 Step 4: Verify Deployment

### Check Backend:
```bash
curl http://localhost:8004/api/photos
```

### Check PM2:
```bash
pm2 list
pm2 logs baby-photo-backend
```

### Check Nginx:
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Test URLs:
- Backend: `https://api.babyphotoadmin.online/api/photos`
- Admin: `https://babyphotoadmin.online`

---

## 🔒 Step 5: SSL Certificate

If you skipped SSL during deployment, run:

```bash
sudo certbot --nginx -d api.babyphotoadmin.online -d babyphotoadmin.online -d www.babyphotoadmin.online
```

Follow prompts:
1. Enter email address
2. Agree to terms (Y)
3. Redirect HTTP to HTTPS (2)

---

## 📱 Step 6: Update Mobile App

The mobile app is already configured to use:
```
https://api.babyphotoadmin.online/api
```

Just rebuild your mobile app and it will work!

---

## 🎯 Final URLs

- **Backend API**: `https://api.babyphotoadmin.online`
- **Admin Panel**: `https://babyphotoadmin.online`
- **Mobile App API**: `https://api.babyphotoadmin.online/api`

---

## 🔧 Troubleshooting

### Backend not starting:
```bash
pm2 logs baby-photo-backend --lines 50
# Check MongoDB connection
```

### Admin panel not loading:
```bash
cd /var/www/baby-photo-prompt/admin-panel
npm run build
sudo systemctl reload nginx
```

### SSL certificate failed:
```bash
# Make sure DNS is propagated first
ping api.babyphotoadmin.online

# Then retry
sudo certbot --nginx -d api.babyphotoadmin.online -d babyphotoadmin.online
```

### Port 8004 not accessible:
```bash
# Check if backend is running
pm2 list

# Check firewall
sudo ufw allow 8004
sudo ufw status

# Check if port is listening
sudo netstat -tulpn | grep 8004
```

---

## 📊 Useful Commands

```bash
# PM2
pm2 list                        # List all processes
pm2 logs baby-photo-backend     # View logs
pm2 restart baby-photo-backend  # Restart
pm2 monit                       # Monitor

# Nginx
sudo systemctl status nginx     # Status
sudo systemctl reload nginx     # Reload
sudo nginx -t                   # Test config
sudo tail -f /var/log/nginx/error.log  # Logs

# SSL
sudo certbot certificates       # List certificates
sudo certbot renew             # Renew certificates
```

---

## 🔐 Environment Variables

### Backend (.env):
```env
PORT=8004
MONGODB_URI=mongodb+srv://babyphotoprompt:Dipak%40123@cluster0.zusd6eh.mongodb.net/baby_photo_prompt?appName=Cluster0
NODE_ENV=production
```

### Admin Panel (.env.production):
```env
VITE_API_URL=https://api.babyphotoadmin.online
```

---

## 📞 Support

**Email**: pearlproduction9@gmail.com

---

**Happy Deploying! 🚀**
