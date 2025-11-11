# Data Import Script

This script imports your dummy data from `dummyData.ts` into Firestore collections.

## What it imports:

### 📁 **Categories Collection**
- Organik Meyve
- Organik Sebze  
- Doğal Süt Ürünleri
- Kuruyemiş & Bakliyat
- Organik İçecekler

### 🛍️ **Products Collection**
- All products from your dummy data
- Includes pricing, stock, location data
- Organized by categories and districts

### 🚚 **Delivery Slots Collection**
- 7 days of delivery slots
- Different time slots for each district
- Beylikdüzü: 3 time slots per day
- Başakşehir: 4 time slots per day

## How to run:

```bash
# Install ts-node if not already installed
npm install -g ts-node

# Run the import script
npm run import-data
```

## What happens:

1. **Connects to your Firestore** using your Firebase config
2. **Imports categories** first (required for products)
3. **Imports all products** with full details
4. **Generates delivery slots** for the next 7 days
5. **Shows progress** for each item imported

## After import:

- Your Firestore will have 3 collections populated
- Your mobile app will use real data instead of dummy data
- You can test all features with real Firestore data

## Troubleshooting:

- **Permission errors**: Make sure Firestore is in test mode
- **Connection errors**: Check your Firebase config
- **Import fails**: Check console for specific error messages



