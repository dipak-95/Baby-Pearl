#!/bin/bash

# Baby AI Photo Prompt - VPS Deployment Script
# Domain: babyphotoadmin.online
# Backend Port: 8004

echo "🚀 Starting deployment for babyphotoadmin.online..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/baby-photo-prompt"
BACKEND_DIR="$PROJECT_DIR/backend"
ADMIN_DIR="$PROJECT_DIR/admin-panel"
DOMAIN_API="api.babyphotoadmin.online"
DOMAIN_ADMIN="babyphotoadmin.online"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Step 1: Backend Deployment
echo -e "${BLUE}📦 Deploying Backend (Port 8004)...${NC}"
cd $BACKEND_DIR

# Pull latest code (if using git)
# git pull origin main

# Install dependencies
echo "Installing backend dependencies..."
npm install --production

# Copy production env
if [ -f .env.production ]; then
    cp .env.production .env
    echo -e "${GREEN}✅ Environment file configured${NC}"
else
    echo -e "${RED}❌ .env.production not found!${NC}"
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Installing PM2...${NC}"
    npm install -g pm2
fi

# Restart or start PM2
if pm2 list | grep -q "baby-photo-backend"; then
    echo "Restarting backend..."
    pm2 restart baby-photo-backend
else
    echo "Starting backend..."
    pm2 start server.js --name baby-photo-backend
fi

pm2 save

echo -e "${GREEN}✅ Backend deployed on port 8004${NC}"

# Step 2: Admin Panel Build
echo -e "${BLUE}🎨 Building Admin Panel...${NC}"
cd $ADMIN_DIR

# Pull latest code (if using git)
# git pull origin main

# Install dependencies
echo "Installing admin dependencies..."
npm install

# Build for production
echo "Building admin panel..."
npm run build

if [ -d "dist" ]; then
    echo -e "${GREEN}✅ Admin Panel built successfully${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Step 3: Nginx Configuration
echo -e "${BLUE}🌐 Configuring Nginx...${NC}"

# Copy nginx config
sudo cp $PROJECT_DIR/nginx.conf /etc/nginx/sites-available/baby-photo-prompt

# Create symlink if not exists
if [ ! -f /etc/nginx/sites-enabled/baby-photo-prompt ]; then
    sudo ln -s /etc/nginx/sites-available/baby-photo-prompt /etc/nginx/sites-enabled/
    echo "Nginx site enabled"
fi

# Test nginx config
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    # Reload nginx
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx configured and reloaded${NC}"
else
    echo -e "${RED}❌ Nginx configuration error${NC}"
    exit 1
fi

# Step 4: Firewall Configuration
echo -e "${BLUE}🔥 Configuring Firewall...${NC}"
if command -v ufw &> /dev/null; then
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw allow 8004/tcp
    echo -e "${GREEN}✅ Firewall configured${NC}"
fi

# Step 5: SSL Certificate
echo ""
read -p "Do you want to setup SSL certificate? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🔒 Setting up SSL...${NC}"
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        echo "Installing Certbot..."
        sudo apt update
        sudo apt install certbot python3-certbot-nginx -y
    fi
    
    # Get SSL certificate
    sudo certbot --nginx -d $DOMAIN_API -d $DOMAIN_ADMIN -d www.$DOMAIN_ADMIN
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ SSL configured${NC}"
    else
        echo -e "${YELLOW}⚠️  SSL setup failed. You can run it manually later:${NC}"
        echo "sudo certbot --nginx -d $DOMAIN_API -d $DOMAIN_ADMIN"
    fi
fi

# Step 6: Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "🌐 ${BLUE}Backend API:${NC} https://$DOMAIN_API"
echo -e "🎨 ${BLUE}Admin Panel:${NC} https://$DOMAIN_ADMIN"
echo ""
echo -e "⚙️  ${BLUE}Backend Port:${NC} 8004"
echo -e "💾 ${BLUE}Database:${NC} MongoDB Atlas"
echo ""
echo -e "${YELLOW}PM2 Status:${NC}"
pm2 list
echo ""
echo -e "${BLUE}📋 Useful Commands:${NC}"
echo "  pm2 logs baby-photo-backend       - View backend logs"
echo "  pm2 restart baby-photo-backend    - Restart backend"
echo "  pm2 monit                         - Monitor resources"
echo "  sudo systemctl status nginx       - Check nginx status"
echo "  sudo tail -f /var/log/nginx/error.log - View nginx errors"
echo ""
echo -e "${GREEN}✅ All services are running!${NC}"
echo ""

# Step 7: DNS Check
echo -e "${YELLOW}📡 DNS Configuration Check:${NC}"
echo "Make sure these DNS records are set:"
echo "  A Record:  api.babyphotoadmin.online  →  $(curl -s ifconfig.me)"
echo "  A Record:  babyphotoadmin.online      →  $(curl -s ifconfig.me)"
echo "  A Record:  www.babyphotoadmin.online  →  $(curl -s ifconfig.me)"
echo ""
