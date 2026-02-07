# 🔍 Check Ports for Running PM2 Apps

## Your Current PM2 Apps:
1. **ai-photo-admin** (ID: 0)
2. **backend** (ID: 1)

---

## Commands to Find Their Ports:

### Method 1: Check PM2 Details
```bash
# Get detailed info for each app
pm2 show ai-photo-admin
pm2 show backend
```

Look for:
- **Port** or **env.PORT**
- **Script path** (to check config files)

---

### Method 2: Check Process Ports Directly
```bash
# Get PID from pm2 status (53973 and 53985 from your screenshot)
sudo netstat -tulpn | grep 53973
sudo netstat -tulpn | grep 53985

# OR use lsof
sudo lsof -i -P | grep 53973
sudo lsof -i -P | grep 53985
```

---

### Method 3: Check All Node Ports
```bash
# See all Node.js listening ports
sudo netstat -tulpn | grep node

# OR
sudo ss -tulpn | grep node
```

---

### Method 4: Check PM2 Logs
```bash
# Backend logs might show "Server running on port XXXX"
pm2 logs backend --lines 50

# Admin logs
pm2 logs ai-photo-admin --lines 50
```

---

## Quick One-Liner:
```bash
# Show all listening ports with process names
sudo netstat -tulpn | grep LISTEN | grep -E "53973|53985"
```

---

## Expected Output:
```
tcp  0.0.0.0:5000   LISTEN  53985/node  (backend)
tcp  0.0.0.0:3000   LISTEN  53973/node  (ai-photo-admin)
```

---

## After Finding Ports:

### If Backend is on Port 5000:
✅ Good! Use **5001** for new Baby Photo backend

### If Admin is on Port 3000:
✅ Good! Use **5174** for new Baby Photo admin

---

## Run This Command Now:
```bash
sudo netstat -tulpn | grep LISTEN
```

This will show ALL ports in use!

---

**Copy-paste this and send me the output:**
```bash
pm2 show backend && pm2 show ai-photo-admin
```
