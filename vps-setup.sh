#!/bin/bash
# Quick VPS Setup Script - Copy and paste this entire script

echo "🚀 Baby AI Photo Prompt - VPS Setup"
echo "===================================="
echo ""

# Step 1: Create folder
echo "📁 Step 1: Creating folder..."
cd /var/www
mkdir -p Baby-Pearl
cd Baby-Pearl
echo "✅ Folder created: /var/www/Baby-Pearl"
echo ""

# Step 2: Clone repository
echo "📦 Step 2: Cloning repository..."
git clone https://github.com/dipak-95/Baby-Pearl.git .
echo "✅ Repository cloned"
echo ""

# Step 3: Setup backend .env
echo "⚙️  Step 3: Setting up backend..."
cd backend
cat > .env << 'EOF'
PORT=8004
MONGODB_URI=mongodb+srv://babyphotoprompt:Dipak%40123@cluster0.zusd6eh.mongodb.net/baby_photo_prompt?appName=Cluster0
NODE_ENV=production
EOF
echo "✅ Backend .env configured"
echo ""

# Step 4: Install backend dependencies
echo "📦 Step 4: Installing backend dependencies..."
npm install --production
echo "✅ Backend dependencies installed"
echo ""

# Step 5: Install admin dependencies
echo "📦 Step 5: Installing admin dependencies..."
cd ../admin-panel
npm install
echo "✅ Admin dependencies installed"
echo ""

# Step 6: Make deploy script executable
echo "🔧 Step 6: Preparing deployment..."
cd /var/www/Baby-Pearl
chmod +x deploy.sh
echo "✅ Deploy script ready"
echo ""

# Step 7: Run deployment
echo "🚀 Step 7: Running deployment..."
echo "This will:"
echo "  - Start backend on port 8004"
echo "  - Build admin panel"
echo "  - Configure Nginx"
echo "  - Setup SSL (you'll be prompted)"
echo ""
read -p "Press Enter to continue with deployment..."
sudo ./deploy.sh

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Make sure DNS is configured:"
echo "   - api.babyphotoadmin.online → YOUR_VPS_IP"
echo "   - babyphotoadmin.online → YOUR_VPS_IP"
echo ""
echo "2. Access your apps:"
echo "   - Backend API: https://api.babyphotoadmin.online"
echo "   - Admin Panel: https://babyphotoadmin.online"
echo ""
echo "3. Check status:"
echo "   pm2 list"
echo "   sudo systemctl status nginx"
echo ""
