# 🚀 Quick VPS Port Check & Deploy

## Step 1: SSH into VPS
```bash
ssh root@YOUR_VPS_IP
```

## Step 2: Check What's Running
```bash
# See all ports in use
sudo netstat -tulpn | grep LISTEN

# See PM2 processes
pm2 list

# See all Node processes
ps aux | grep node
```

## Step 3: Find Free Ports

**Example Output:**
```
tcp  0.0.0.0:3000  LISTEN  12345/node  (Project 1)
tcp  0.0.0.0:5000  LISTEN  12346/node  (Project 2)
```

**Available Ports:** 5001, 5002, 5173, 5174, etc.

## Step 4: Use These Ports

### Backend: Port 5001
```bash
cd /path/to/Baby\ Photo\ Prompt/backend
nano .env
```
Add:
```
PORT=5001
```

### Admin Panel: Port 5174
```bash
cd /path/to/Baby\ Photo\ Prompt/admin-panel
nano vite.config.js
```
Add:
```javascript
export default {
  server: {
    port: 5174
  }
}
```

## Step 5: Deploy

### Backend:
```bash
cd backend
npm install
pm2 start server.js --name baby-photo-api
pm2 save
```

### Admin Panel:
```bash
cd admin-panel
npm install
npm run build
pm2 serve dist 5174 --name baby-photo-admin --spa
pm2 save
```

## Step 6: Access

- **Backend**: http://YOUR_VPS_IP:5001
- **Admin**: http://YOUR_VPS_IP:5174

## Common Commands

```bash
# View all PM2 apps
pm2 list

# View logs
pm2 logs

# Restart app
pm2 restart baby-photo-api

# Stop app
pm2 stop baby-photo-api

# Delete app
pm2 delete baby-photo-api
```

## If Port is Busy

```bash
# Find what's using port 5001
sudo lsof -i :5001

# Kill it (replace PID)
sudo kill -9 PID
```

---

**That's it!** 🎉
