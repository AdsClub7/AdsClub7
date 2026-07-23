# AdsClub - Watch Ads and Earn

A web application where users can watch advertisements and earn money. Features include user registration, ad viewing, earning tracking, withdrawals, and a comprehensive admin panel.

## Features

### User Features
- **Registration**: Mobile number + password authentication
- **Ad Viewing**: Watch ads and earn money (₹0.50 per ad by default)
- **Balance Tracking**: View earned balance
- **Withdrawal System**: Request withdrawals
- **Dashboard**: Personal statistics and history

### Admin Features
- **User Management**: View and manage users
- **Settings Panel**: Configure earnings per ad (₹)
- **Withdrawal Settings**: Set minimum withdrawal amount
- **Financial Reports**: Track payments and earnings
- **Ad Management**: Upload and manage ads
- **Withdrawal Requests**: Approve/Reject user withdrawals

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Frontend**: HTML5, CSS3, JavaScript (Responsive)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, CORS

## Installation

1. Clone the repository
```bash
git clone https://github.com/AdsClub7/AdsClub7.git
cd AdsClub7
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB service

5. Run the server
```bash
npm run dev
```

6. Access the application
- User Portal: http://localhost:5000
- Admin Panel: http://localhost:5000/admin

## Project Structure

```
├── server.js           # Main server file
├── config/            # Configuration files
├── models/            # Database models
├── routes/            # API routes
├── controllers/        # Route controllers
├── middleware/        # Custom middleware
├── public/            # Static files (CSS, JS)
├── views/             # HTML templates
└── uploads/           # Uploaded files
```

## Default Credentials

- **Admin Panel**: Use your configured ADMIN_EMAIL and ADMIN_PASSWORD

## Monetag Integration

Meta tag for Monetag is already configured in the HTML:
```html
<meta name="monetag" content="f82ee70dfdf348dc4be3e416120a277d">
```

## License

ISC
