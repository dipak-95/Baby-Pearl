# 🚀 VPS Deployment Commands - Baby AI Photo Prompt

## Step-by-Step VPS Setup Commands

---

## Step 1: SSH into VPS

```bash
ssh root@YOUR_VPS_IP
```

Enter your password when prompted.

---

## Step 2: Create Project Folder

```bash
# Navigate to /var/www
cd /var/www

# Create Baby-Pearl folder
mkdir -p Baby-Pearl

# Verify folder created
ls -la
```

**Expected Output:**
```
drwxr-xr-x  2 root root 4096 Feb  7 14:32 Baby-Pearl
```

---

## Step 3: Clone Repository

```bash
# Navigate into Baby-Pearl folder
cd Baby-Pearl

# Clone the repository
git clone https://github.com/dipak-95/Baby-Pearl.git .

# Note: The dot (.) at the end clones into current directory
```

**Alternative (if you want repo inside Baby-Pearl):**
```bash
cd /var/www/Baby-Pearl
git clone https://github.com/dipak-95/Baby-Pearl.git baby-photo-prompt
cd baby-photo-prompt
```

---

## Step 4: Verify Files

```bash
# Check if all files are cloned
ls -la

# You should see:
# - backend/
# - admin-panel/
# - mobile-app/
# - nginx.conf
# - deploy.sh
# - DEPLOYMENT_FINAL.md
# - etc.
```

---

## Step 5: Update Configuration Files

### A. Backend Environment

```bash
cd backend
nano .env
```

**Add/Update:**
```env
PORT=8004
MONGODB_URI=mongodb+srv://babyphotoprompt:Dipak%40123@cluster0.zusd6eh.mongodb.net/baby_photo_prompt?appName=Cluster0
NODE_ENV=production
```

**Save:** `Ctrl+X`, then `Y`, then `Enter`

### B. Update Nginx Config

```bash
cd /var/www/Baby-Pearl
nano nginx.conf
```

**Verify these lines are correct:**
```nginx
server_name api.babyphotoadmin.online;    # Line 7
server_name babyphotoadmin.online www.babyphotoadmin.online admin.babyphotoadmin.online;  # Line 42
```

**Save:** `Ctrl+X`, then `Y`, then `Enter`

---

## Step 6: Install Dependencies

### Backend:
```bash
cd /var/www/Baby-Pearl/backend
npm install --production
```

### Admin Panel:
```bash
cd /var/www/Baby-Pearl/admin-panel
npm install
```

---

## Step 7: Run Deployment Script

```bash
cd /var/www/Baby-Pearl
chmod +x deploy.sh
sudo ./deploy.sh
```

**The script will:**
- ✅ Start backend on port 8004
- ✅ Build admin panel
- ✅ Configure Nginx
- ✅ Setup firewall
- ✅ Offer SSL setup

---

## Step 8: Setup SSL Certificate

When prompted during deployment, choose `Y` for SSL.

**Or run manually:**
```bash
sudo certbot --nginx -d api.babyphotoadmin.online -d babyphotoadmin.online -d www.babyphotoadmin.online
```

**Follow prompts:**
1. Enter email: `pearlproduction9@gmail.com`
2. Agree to terms: `Y`
3. Redirect HTTP to HTTPS: `2`

---

## Step 9: Verify Deployment

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
```

### Test URLs:
```bash
# Backend API
curl https://api.babyphotoadmin.online/api/photos

# Admin Panel
curl https://babyphotoadmin.online
```

---

## 🔥 Quick Copy-Paste Commands

**Complete setup in one go:**

```bash
# 1. Create folder and clone
cd /var/www
mkdir -p Baby-Pearl
cd Baby-Pearl
git clone https://github.com/dipak-95/Baby-Pearl.git .

# 2. Setup backend
cd backend
cat > .env << EOF
PORT=8004
MONGODB_URI=mongodb+srv://babyphotoprompt:Dipak%40123@cluster0.zusd6eh.mongodb.net/baby_photo_prompt?appName=Cluster0
NODE_ENV=production
EOF

# 3. Install dependencies
npm install --production
cd ../admin-panel
npm install

# 4. Run deployment
cd /var/www/Baby-Pearl
chmod +x deploy.sh
sudo ./deploy.sh
```

---

## 📊 Useful Commands

### PM2 Management:
```bash
pm2 list                        # List all processes
pm2 logs baby-photo-backend     # View logs
pm2 restart baby-photo-backend  # Restart backend
pm2 stop baby-photo-backend     # Stop backend
pm2 monit                       # Monitor resources
```

### Nginx Management:
```bash
sudo systemctl status nginx     # Check status
sudo systemctl restart nginx    # Restart
sudo nginx -t                   # Test config
sudo tail -f /var/log/nginx/error.log  # View errors
```

### Git Updates:
```bash
cd /var/www/Baby-Pearl
git pull                        # Pull latest changes
sudo ./deploy.sh               # Redeploy
```

---

## 🔧 Troubleshooting

### Port 8004 already in use:
```bash
sudo lsof -i :8004
sudo kill -9 <PID>
```

### Nginx errors:
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### PM2 not starting:
```bash
pm2 logs baby-photo-backend --lines 50
```

### MongoDB connection failed:
```bash
# Check if MongoDB URI is correct in .env
cat backend/.env
```

---

## ✅ Final Checklist

- [ ] Folder created: `/var/www/Baby-Pearl`
- [ ] Repository cloned
- [ ] Backend `.env` configured
- [ ] Dependencies installed
- [ ] Deployment script executed
- [ ] Backend running on PM2
- [ ] Admin panel built
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] URLs accessible:
  - [ ] https://api.babyphotoadmin.online
  - [ ] https://babyphotoadmin.online

---

## 🎯 Final URLs

- **Backend API**: https://api.babyphotoadmin.online
- **Admin Panel**: https://babyphotoadmin.online
- **GitHub Repo**: https://github.com/dipak-95/Baby-Pearl.git

---

**Happy Deploying! 🚀**
