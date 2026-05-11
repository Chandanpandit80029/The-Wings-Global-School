# Firestore Database Setup Guide

This guide explains how to create the required Firestore collections for the Wings Global School platform.

## Method 1: Automatic Creation (Recommended)

Firestore collections are created automatically when you first add data to them. Simply:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Log in to the admin dashboard:**
   - Go to `http://localhost:3000/admin/login`
   - Use your admin credentials

3. **Create your first item in each section:**
   - Go to Announcements → Click "New Announcement" → Fill form → Save
   - Go to News → Click "New Article" → Fill form → Save
   - Go to Events → Click "New Event" → Fill form → Save
   - Go to Faculty → Click "Add Faculty" → Fill form → Save
   - Go to Gallery → Click "New Gallery Item" → Fill form → Save
   - Go to Downloads → Click "New Download" → Fill form → Save

4. **Test public forms:**
   - Visit `/admissions` and submit an application
   - Visit `/contact` and send a message

The collections will be created automatically in Firebase!

## Method 2: Manual Creation via Firebase Console

If you prefer to create collections manually:

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select the "wings-global-school" project
3. Navigate to **Firestore Database** in the left sidebar

### Step 2: Create Collections

Click "Start collection" for each of the following:

#### 1. users Collection
- **Collection ID:** `users`
- **Document ID:** (Use the UID from Authentication)
- **Fields:**
  ```json
  {
    "email": "admin@wingsglobal.edu",
    "name": "Admin User",
    "role": "admin",
    "createdAt": "[timestamp]"
  }
  ```

#### 2. announcements Collection
- **Collection ID:** `announcements`
- **Document ID:** Auto-ID
- **Fields:**
  ```json
  {
    "title": "Sample Announcement",
    "description": "This is a test announcement",
    "category": "General",
    "mediaUrl": "",
    "createdAt": "[timestamp]",
    "updatedAt": "[timestamp]"
  }
  ```

#### 3. news Collection
- **Collection ID:** `news`
- **Document ID:** Auto-ID
- **Fields:**
  ```json
  {
    "title": "Sample News Article",
    "description": "This is a test news article",
    "content": "Full content here...",
    "category": "School",
    "mediaUrl": "",
    "createdAt": "[timestamp]",
    "updatedAt": "[timestamp]"
  }
  ```

#### 4. events Collection
- **Collection ID:** `events`
- **Document ID:** Auto-ID
- **Fields:**
  ```json
  {
    "title": "Sample Event",
    "description": "This is a test event",
    "date": "2024-12-31",
    "time": "10:00",
    "location": "Main Hall",
    "category": "Academic",
    "mediaUrl": "",
    "createdAt": "[timestamp]",
    "updatedAt": "[timestamp]"
  }
  ```

#### 5. faculty Collection
- **Collection ID:** `faculty`
- **Document ID:** Auto-ID
- **Fields:**
  ```json
  {
    "name": "John Doe",
    "subject": "Mathematics",
    "qualification": "PhD in Mathematics",
    "experience": 10,
    "email": "john.doe@wingsglobal.edu",
    "bio": "Experienced mathematics professor...",
    "imageUrl": "",
    "createdAt": "[timestamp]",
    "updatedAt": "[timestamp]"
  }
  ```

#### 6. gallery Collection
- **Collection ID:** `gallery`
- **Document ID:** Auto-ID
- **Fields:**
  ```json
  {
    "title": "Sample Gallery Item",
    "description": "Description of the image",
    "category": "Academic",
    "mediaUrl": "https://example.com/image.jpg",
    "type": "image",
    "createdAt": "[timestamp]",
    "updatedAt": "[timestamp]"
  }
  ```

#### 7. downloads Collection
- **Collection ID:** `downloads`
- **Document ID:** Auto-ID
- **Fields:**
  ```json
  {
    "title": "Sample Document",
    "description": "Description of the document",
    "category": "Form",
    "fileUrl": "https://example.com/document.pdf",
    "fileType": "pdf",
    "createdAt": "[timestamp]",
    "updatedAt": "[timestamp]"
  }
  ```

#### 8. heroSlider Collection
- **Collection ID:** `heroSlider`
- **Document ID:** Auto-ID
- **Fields:**
  ```json
  {
    "title": "Welcome to Wings Global School",
    "subtitle": "Empowering minds, shaping futures",
    "buttonText": "Apply Now",
    "buttonLink": "/admissions",
    "imageUrl": "https://example.com/hero-image.jpg",
    "isActive": true,
    "order": 1,
    "createdAt": "[timestamp]",
    "updatedAt": "[timestamp]"
  }
  ```

#### 9. admissions Collection
- **Collection ID:** `admissions`
- **Document ID:** Auto-ID
- **Fields:**
  ```json
  {
    "name": "Student Name",
    "email": "parent@email.com",
    "phone": "+1234567890",
    "grade": "Grade 5",
    "parentName": "Parent Name",
    "message": "Additional information...",
    "createdAt": "[timestamp]",
    "updatedAt": "[timestamp]"
  }
  ```

#### 9. messages Collection
- **Collection ID:** `messages`
- **Document ID:** Auto-ID
- **Fields:**
  ```json
  {
    "name": "Sender Name",
    "email": "sender@email.com",
    "phone": "+1234567890",
    "subject": "Inquiry",
    "message": "Message content...",
    "createdAt": "[timestamp]",
    "updatedAt": "[timestamp]"
  }
  ```

## Method 3: Using Firebase CLI

You can also import data using Firebase CLI:

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login:**
   ```bash
   firebase login
   ```

3. **Import data (if you have a JSON export):**
   ```bash
   firebase firestore:import data.json
   ```

## Verifying Collections

After creating collections, verify they exist:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. You should see all 10 collections listed

## Deploying Security Rules

Don't forget to deploy the security rules:

```bash
firebase deploy --only firestore:rules
```

This ensures:
- Public can read website content
- Only admins can create/edit/delete content
- Anyone can submit admission applications and contact messages

## Troubleshooting

### Collections not showing up?
- Make sure you've added at least one document to each collection
- Refresh the Firebase Console
- Check that you're in the correct Firebase project

### Permission denied errors?
- Ensure security rules are deployed
- Verify the admin user exists in both Authentication and Firestore `users` collection
- Check that the user document has `role: "admin"`

### Need to delete test data?
- Go to Firestore Database in Firebase Console
- Click on the collection
- Select documents and click "Delete"

## Next Steps

1. Deploy the security rules
2. Create an admin user
3. Start adding real content through the admin dashboard
4. Test the public forms (admissions, contact)

For more information, see the main [README.md](./README.md).