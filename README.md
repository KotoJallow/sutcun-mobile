# sutcun-mobile

Run the app:

```bash
# From the project root
npx expo start --tunnel
```

Firestore index for deliveryTimeSlots

The app queries the `deliveryTimeSlots` collection using multiple fields (district, neighborhood, date) and orders by `startTime`. Firestore requires a composite index for that query. A `firestore.indexes.json` file has been added to the project root that requests this composite index.

To deploy the index using the Firebase CLI:

1. Install and login to the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
```

2. From the project root, select the project and deploy just the indexes:

```bash
firebase use --add   # select or add the sutcundev project
firebase deploy --only firestore:indexes
```

If you prefer the Console, open the index creation link provided by Firestore in the error message (example):

https://console.firebase.google.com/v1/r/project/sutcundev/firestore/indexes?create_composite

Alternatively, create the index in the Firebase Console under Firestore > Indexes.

If you can't create the index right away, the app falls back to dummy/local delivery slots (see `src/services/dataService.ts`).
# sutcun-mobile
#Run npx expo start --tunnel incase of errors with npx expo start
