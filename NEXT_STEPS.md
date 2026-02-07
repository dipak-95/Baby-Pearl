# 🚀 Next Steps After npm install - Baby AI Photo Prompt

## ✅ Current Status:
- [x] Repository cloned
- [x] Backend npm install done
- [x] Admin panel npm install done

---

## 📋 Step-by-Step Next Steps:

### **Step 1: Configure Backend Environment**

```bash
cd /var/www/Baby-Pearl/backend
nano .env
```

**Add these lines:**
```env
PORT=8004
MONGODB_URI=mongodb+srv://babyphotoprompt:Dipak%40123@cluster0.zusd6eh.mongodb.net/baby_photo_prompt?appName=Cluster0
NODE_ENV=production
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

**Verify:**
```bash
cat .env
```

---

### **Step 2: Start Backend with PM2**

```bash
# Install PM2 globally (if not installed)
npm install -g pm2

# Start backend
cd /var/www/Baby-Pearl/backend
pm2 start server.js --name baby-photo-backend

# Save PM2 process list
pm2 save

# Enable PM2 to start on boot
pm2 startup
# Copy and run the command it shows
```

**Verify Backend is Running:**
```bash
pm2 list
pm2 logs baby-photo-backend --lines 20
```

**Test Backend:**
```bash
curl http://localhost:8004/api/photos
```

---

### **Step 3: Build Admin Panel**

```bash
cd /var/www/Baby-Pearl/admin-panel

# Update .env.production (if not already done)
nano .env.production
```

**Add:**
```env
VITE_API_URL=https://api.babyphotoadmin.online
```

**Save and build:**
```bash
npm run build
```

**Verify build folder created:**
```bash
ls -la dist/
```

---

### **Step 4: Configure Nginx**

```bash
cd /var/www/Baby-Pearl

# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/baby-photo-prompt

# Create symlink
sudo ln -s /etc/nginx/sites-available/baby-photo-prompt /etc/nginx/sites-enabled/

# Remove default site (if exists)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx config
sudo nginx -t
```

**If test passes:**
```bash
sudo systemctl reload nginx
```

---

### **Step 5: Configure Firewall**

```bash
# Allow necessary ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8004/tcp

# Check firewall status
sudo ufw status
```

---

### **Step 6: Setup SSL Certificate**

```bash
# Install Certbot (if not installed)
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d api.babyphotoadmin.online -d babyphotoadmin.online -d www.babyphotoadmin.online
```

**Follow prompts:**
1. **Email**: `pearlproduction9@gmail.com`
2. **Agree to terms**: `Y`
3. **Share email**: `N` (optional)
4. **Redirect HTTP to HTTPS**: `2` (Yes)

**Verify SSL:**
```bash
sudo certbot certificates
```

---

### **Step 7: Verify Everything**

#### **A. Check PM2:**
```bash
pm2 list
pm2 logs baby-photo-backend
```

**Expected:** Backend should be running without errors

#### **B. Check Nginx:**
```bash
sudo systemctl status nginx
```

**Expected:** Active (running)

#### **C. Test Backend API:**
```bash
# Local test
curl http://localhost:8004/api/photos

# Public test
curl https://api.babyphotoadmin.online/api/photos
```

**Expected:** JSON response with photos array

#### **D. Test Admin Panel:**
```bash
curl https://babyphotoadmin.online
```

**Expected:** HTML response

#### **E. Open in Browser:**
- **Backend API**: https://api.babyphotoadmin.online/api/photos
- **Admin Panel**: https://babyphotoadmin.online

---

## 🎯 Quick Command Summary:

```bash
# 1. Configure backend
cd /var/www/Baby-Pearl/backend
cat > .env << 'EOF'
PORT=8004
MONGODB_URI=mongodb+srv://babyphotoprompt:Dipak%40123@cluster0.zusd6eh.mongodb.net/baby_photo_prompt?appName=Cluster0
NODE_ENV=production
EOF

# 2. Start backend
pm2 start server.js --name baby-photo-backend
pm2 save

# 3. Build admin
cd /var/www/Baby-Pearl/admin-panel
npm run build

# 4. Configure Nginx
cd /var/www/Baby-Pearl
sudo cp nginx.conf /etc/nginx/sites-available/baby-photo-prompt
sudo ln -s /etc/nginx/sites-available/baby-photo-prompt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 5. Setup SSL
sudo certbot --nginx -d api.babyphotoadmin.online -d babyphotoadmin.online -d www.babyphotoadmin.online

# 6. Check status
pm2 list
sudo systemctl status nginx
curl https://api.babyphotoadmin.online/api/photos
```

---

## 🔧 Troubleshooting:

### **Backend not starting:**
```bash
pm2 logs baby-photo-backend --lines 50
# Check for MongoDB connection errors
```

### **Nginx test fails:**
```bash
sudo nginx -t
# Check error message
sudo tail -f /var/log/nginx/error.log
```

### **SSL certificate fails:**
```bash
# Make sure DNS is propagated
ping api.babyphotoadmin.online
ping babyphotoadmin.online

# Wait 5-10 minutes and try again
```

### **Port 8004 already in use:**
```bash
sudo lsof -i :8004
sudo kill -9 <PID>
pm2 restart baby-photo-backend
```

---

## ✅ Final Checklist:

- [ ] Backend `.env` configured
- [ ] Backend running on PM2 (port 8004)
- [ ] Admin panel built (`dist/` folder exists)
- [ ] Nginx configured
- [ ] Nginx test passed
- [ ] Nginx reloaded
- [ ] Firewall configured
- [ ] SSL certificate installed
- [ ] Backend API accessible: https://api.babyphotoadmin.online/api/photos
- [ ] Admin panel accessible: https://babyphotoadmin.online

---

## 📊 Expected Results:

### **PM2 List:**
```
┌─────┬──────────────────────┬─────────┬─────────┬──────────┐
│ id  │ name                 │ mode    │ status  │ cpu      │
├─────┼──────────────────────┼─────────┼─────────┼──────────┤
│ 0   │ baby-photo-backend   │ fork    │ online  │ 0%       │
└─────┴──────────────────────┴─────────┴─────────┴──────────┘
```

### **Nginx Status:**
```
● nginx.service - A high performance web server
   Active: active (running)
```

### **Backend Response:**
```json
[
  {
    "_id": "...",
    "gender": "boy",
    "type": "month",
    "category": "1 Month",
    "prompt": "...",
    "imageUrl": "..."
  }
]
```

---

## 🎉 Success!

If all steps complete successfully:

- ✅ **Backend API**: https://api.babyphotoadmin.online
- ✅ **Admin Panel**: https://babyphotoadmin.online
- ✅ **SSL**: Enabled with auto-renewal
- ✅ **Auto-start**: PM2 configured to start on boot

---

## 📱 Update Mobile App:

The mobile app is already configured with:
```typescript
export const API_URL = 'https://api.babyphotoadmin.online/api';
```

Just rebuild and publish to app stores!

---

**Follow these steps one by one! Let me know if you face any issues! 🚀**
