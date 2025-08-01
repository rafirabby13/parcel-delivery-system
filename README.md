<h2 align="left">Live Site</h2>

###

<h4 align="left">https://parcel-delivery-system-zeta.vercel.app/</h4>

###

<h2 align="left">Parcel Delivery System</h2>

###

<p align="left">This is a role-based, secure, modular backend API for a Parcel Delivery Management System inspired by services like **Pathao Courier** or **Sundarban**. It allows users to register as **senders** or **receivers**, create parcel requests, track deliveries, and manage parcel statuses. Admins can manage users and parcels, enforce policies, and oversee delivery operations.</p>

###

<h2 align="left">Technologies Used</h2>

###

<p align="left">- **Node.js** with **Express**<br>- **MongoDB** + **Mongoose**<br>- **JWT Authentication**<br>- **Zod** for input validation<br>- **bcrypt** for password hashing<br>- **TypeScript**<br>- **Role-based Access Control (RBAC)**</p>

###

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" alt="typescript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" height="40" alt="mongodb logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" height="40" alt="express logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg" height="40" alt="eslint logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="40" alt="nodejs logo"  />
</div>

###

<h2 align="left">Features</h2>

###

<p align="left">✅ Sender:<br><br>-Create a new parcel<br>-Cancel (if not picked up)<br>-View parcel history & status updates<br><br>✅ Receiver:<br><br>-Track incoming parcels<br>-Confirm delivery<br>-View delivery logs<br><br>✅ Admin:<br><br>-View/manage all users & parcels<br>-Block/unblock users<br>-Manually update parcel statuses<br>-Assign delivery personnel (optional)</p>

###

<h2 align="left">📜 Validation & Business Rules</h2>

###

<p align="left">*Senders can only cancel before dispatch.<br>*Receivers can confirm delivery.<br>*Blocked users are restricted.<br>*Parcel cancellation disallowed after PICKED_UP.<br>*Return requests allowed only in specific statuses (APPROVED, PICKED_UP, IN_TRANSIT).<br>*COD parcels can't be returned after dispatch.<br>*Admins override all roles and enforce status changes.</p>

###

<h2 align="left">🔍 API Highlights</h2>

###

<p align="left">-Tracking ID Format: TRK-YYYYMMDD-XXXXXX<br>-Status transitions enforced via Zod<br>-Transactions used for payment cancel/refund & return logic<br>-All errors handled centrally with meaningful messages</p>

###

<h2 align="left">🔐 Authentication & Authorization</h2>

###

<p align="left">--JWT-based auth with access and refresh tokens.<br><br>--Three roles:<br><br>-SENDER – Can create, cancel, and track their parcels<br>-RECEIVER – Can track, confirm delivery<br>-ADMIN – Full control over parcels, users, and status updates<br><br>--Passwords are hashed securely using bcrypt.</p>

###

<h2 align="left">🚚 Parcel Lifecycle & Business Logic</h2>

###

<p align="left">REQUESTED → APPROVED → PICKED_UP → IN_TRANSIT → DELIVERED → RETURNED</p>

###

<h2 align="left">🧪 API Testing (via Postman)</h2>

###

<p align="left">-JWT token handling<br>-Role access checks<br>-Parcel status changes<br>-Return and refund logic<br>-Blocked user edge cases</p>

###

<h2 align="left">🔐 Role-Based Route Access</h2>

###

<p align="left">| Endpoint                    | Role Access     |<br>| --------------------------- | --------------- |<br>| POST /auth/register         | Public          |<br>| POST /auth/login            | Public          |<br>| GET /parcels/me             | Sender          |<br>| POST /parcels               | Sender          |<br>| PATCH /parcels/\:id/cancel  | Sender          |<br>| GET /parcels/\:id           | Sender/Receiver |<br>| PATCH /parcels/\:id/confirm | Receiver        |<br>| GET /admin/parcels          | Admin           |<br>| PATCH /admin/users/\:id     | Admin           |<br>| PATCH /admin/parcels/\:id   | Admin           |</p>

###

<h2 align="left">📦 Parcel Schema Sample</h2>

###

<p align="left">{<br>  trackingId: "TRK-20250731-123456",<br>  senderId: ObjectId,<br>  receiverId: ObjectId,<br>  weight: Number,<br>  status: 'IN_TRANSIT',<br>  paymentMethod: 'COD' | 'PREPAID',<br>  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED',<br>  trackingEvents: [<br>    {<br>      status: 'PICKED_UP',<br>      location: 'Banani',<br>      note: 'Picked by rider',<br>      updaterId: ObjectId,<br>      timestamp: Date<br>    }<br>  ]<br>}</p>

###

<h2 align="left">⚙️ Getting Started</h2>

###

<h3 align="left">🔄 Clone the Repo</h3>

###

<p align="left">git clone this repo<br>cd parcel-delivery-api</p>

###

<h3 align="left">🧪 Run in Dev Mode</h3>

###

<p align="left">npm run dev</p>

###

<h3 align="left">🔨 Build & Start</h3>

###

<p align="left">npm run build<br>npm start</p>

###