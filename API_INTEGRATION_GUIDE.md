# Sutcun Mobile App - Data Source Configuration

## How to Switch Between Dummy Data and API

The app is now configured to easily switch between dummy data and real API calls. Here's how to do it:

### 1. **Current Setup (Using Dummy Data)**
The app is currently configured to use dummy data by default. This means:
- ✅ All features work immediately
- ✅ No backend required for testing
- ✅ Fast development and testing
- ✅ Works offline

### 2. **To Switch to API Mode**

#### Step 1: Update Configuration
Edit `/src/config/appConfig.ts`:

```typescript
export const CONFIG = {
  // Change this to true to use API calls
  USE_API: true,
  
  // Update with your actual API URL
  API_BASE_URL: 'https://your-api-domain.com',
  
  // Other settings...
};
```

#### Step 2: Update API Base URL
In `/src/services/api.ts`, update the API_BASE_URL:

```typescript
const API_BASE_URL = 'https://your-actual-api-domain.com';
```

#### Step 3: Implement Your Backend API
Make sure your backend implements these endpoints:

**Products:**
- `GET /products` - Get products with optional filters
- `GET /products/:id` - Get single product
- `GET /categories` - Get product categories

**Orders:**
- `POST /orders` - Create new order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get single order
- `PATCH /orders/:id/status` - Update order status

**Delivery:**
- `GET /delivery-slots` - Get available delivery slots

**User:**
- `GET /user/addresses` - Get user addresses
- `POST /user/addresses` - Add new address
- `PUT /user/addresses/:id` - Update address
- `DELETE /user/addresses/:id` - Delete address

### 3. **Current Data Flow**

The app uses a **hybrid approach**:

1. **API First**: Tries to fetch data from your API
2. **Fallback**: If API fails, uses dummy data
3. **Caching**: Caches API responses for better performance
4. **Offline Support**: Works even without internet

### 4. **Testing the Switch**

#### Test with Dummy Data (Current):
```bash
# Run the app - it will use dummy data
npx expo start
```

#### Test with API:
1. Set `USE_API: true` in `appConfig.ts`
2. Update `API_BASE_URL` to your backend
3. Run the app - it will try to fetch from your API
4. If API is not available, it falls back to dummy data

### 5. **Components Updated for API Integration**

✅ **ProductList** - Now uses `useProducts()` hook
✅ **DeliveryTimeSelector** - Now uses `useDeliverySlots()` hook  
✅ **OrdersScreen** - Now uses `useOrders()` hook
✅ **CartScreen** - Now uses `useCreateOrder()` hook

### 6. **Loading States & Error Handling**

All components now include:
- ✅ Loading spinners during API calls
- ✅ Error messages with retry buttons
- ✅ Empty state handling
- ✅ Offline fallback to dummy data

### 7. **Next Steps**

1. **For Development**: Keep `USE_API: false` and continue using dummy data
2. **For Production**: Set `USE_API: true` and implement your backend API
3. **For Testing**: You can toggle between modes easily

### 8. **API Response Format**

Your backend should return data in this format:

```typescript
// Products API Response
{
  "success": true,
  "data": {
    "products": [...],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}

// Orders API Response  
{
  "success": true,
  "data": {
    "orders": [...],
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

### 9. **Troubleshooting**

**If you see dummy data when API is enabled:**
- Check your API URL is correct
- Verify your backend is running
- Check network connectivity
- Look at console logs for API errors

**The app will automatically fall back to dummy data if:**
- API is not available
- Network is offline
- API returns errors
- Backend is not implemented yet

This ensures your app always works, even during development! 🚀
