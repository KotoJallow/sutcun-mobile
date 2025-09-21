// Import script to populate Firestore with dummy data
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
const { products, categories } = require('../src/constants/dummyData');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ7kHUFlwQ4b_KAYJHqsOnNvnbbExEVK4",
  authDomain: "sutcundev.firebaseapp.com",
  projectId: "sutcundev",
  storageBucket: "sutcundev.firebasestorage.app",
  messagingSenderId: "556247586808",
  appId: "1:556247586808:web:d12d81eeea1a4acec6280d",
  measurementId: "G-16LG9MJ009"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Import categories first
async function importCategories() {
  console.log('🌱 Importing categories...');
  
  try {
    for (const category of categories) {
      await addDoc(collection(db, 'categories'), {
        id: category.id,
        name: category.name,
        icon: category.icon,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Added category: ${category.name}`);
    }
    console.log('✅ Categories imported successfully!');
  } catch (error) {
    console.error('❌ Error importing categories:', error);
  }
}

// Import products
async function importProducts() {
  console.log('🛍️ Importing products...');
  
  try {
    for (const product of products) {
      await addDoc(collection(db, 'products'), {
        product_id: product.product_id,
        product_name: product.product_name,
        category_id: product.category_id,
        category_name: product.category_name,
        category_icon: product.category_icon,
        image: product.image,
        district_name: product.district_name,
        neighborhood_name: product.neighborhood_name,
        price: product.price,
        stock_quantity: product.stock_quantity,
        unit: product.unit,
        created_at: product.created_at,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Added product: ${product.product_name}`);
    }
    console.log('✅ Products imported successfully!');
  } catch (error) {
    console.error('❌ Error importing products:', error);
  }
}

// Import delivery time slots
async function importDeliverySlots() {
  console.log('🚚 Importing delivery time slots...');
  
  try {
    // Generate delivery slots for the next 7 days
    const today = new Date();
    const districts = [
      { district: 'Beylikdüzü', neighborhoods: ['Kavaklı', 'Büyükşehir'] },
      { district: 'Başakşehir', neighborhoods: ['Kayabaşı', 'Bahçeşehir'] }
    ];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateStr = date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      const dayOfWeek = date.toLocaleDateString('tr-TR', { weekday: 'long' });
      
      for (const { district, neighborhoods } of districts) {
        for (const neighborhood of neighborhoods) {
          const timeSlots = district === 'Beylikdüzü' 
            ? [
                { start: '10:00', end: '12:00', label: 'Sabah' },
                { start: '14:00', end: '16:00', label: 'Öğleden Sonra' },
                { start: '18:00', end: '20:00', label: 'Akşam' }
              ]
            : [
                { start: '09:00', end: '11:00', label: 'Sabah' },
                { start: '13:00', end: '15:00', label: 'Öğleden Sonra' },
                { start: '17:00', end: '19:00', label: 'Akşam' },
                { start: '19:00', end: '21:00', label: 'Gece' }
              ];
          
          for (const slot of timeSlots) {
            await addDoc(collection(db, 'delivery_slots'), {
              id: `${district}-${neighborhood}-${dateStr}-${slot.start}`,
              date: dateStr,
              dayOfWeek,
              timeRange: `${slot.start}–${slot.end}`,
              label: slot.label,
              district,
              neighborhood,
              isAvailable: Math.random() > 0.2, // 80% availability
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
        }
      }
    }
    console.log('✅ Delivery slots imported successfully!');
  } catch (error) {
    console.error('❌ Error importing delivery slots:', error);
  }
}

// Main import function
async function importAllData() {
  console.log('🚀 Starting data import to Firestore...');
  console.log('📊 Project: sutcundev');
  console.log('📁 Collections: categories, products, delivery_slots');
  console.log('');
  
  try {
    await importCategories();
    console.log('');
    
    await importProducts();
    console.log('');
    
    await importDeliverySlots();
    console.log('');
    
    console.log('🎉 All data imported successfully!');
    console.log('📱 You can now test your mobile app with real Firestore data.');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

// Run the import
importAllData();
