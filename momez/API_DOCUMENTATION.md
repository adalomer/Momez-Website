# 📚 Momez E-Commerce API Dökümanı

## 🔐 Authentication API

### Kayıt Ol
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456",
  "name": "Ahmet Yılmaz",
  "phone": "+905551234567"
}
```

### Giriş Yap
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

### Çıkış Yap
```http
POST /api/auth/logout
```

### Kullanıcı Bilgisi
```http
GET /api/auth/me
Cookie: auth_token=xxx
```

---

## 🛍️ Products API

### Ürün Listesi
```http
GET /api/products?category=ayakkabi&search=nike&limit=20&offset=0
```

### Ürün Detayı
```http
GET /api/products/nike-air-max-270
```

### Ürün Ekle (Admin)
```http
POST /api/products
Content-Type: application/json

{
  "name": "Nike Air Max 270",
  "description": "Rahat ve şık spor ayakkabı",
  "price": 3499.99,
  "category_id": 1,
  "images": ["/uploads/image1.jpg"],
  "stock": [
    { "size": "40", "quantity": 10 },
    { "size": "41", "quantity": 15 }
  ]
}
```

### Ürün Güncelle (Admin)
```http
PUT /api/products/nike-air-max-270
Content-Type: application/json

{
  "price": 3299.99,
  "is_active": true
}
```

### Ürün Sil (Admin)
```http
DELETE /api/products/nike-air-max-270
```

---

## 📁 Categories API

### Kategori Listesi
```http
GET /api/categories
GET /api/categories?parent_id=1
```

### Kategori Ekle (Admin)
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Spor Ayakkabılar",
  "parent_id": null,
  "image_url": "/uploads/category.jpg"
}
```

---

## 🛒 Cart API

### Sepeti Getir
```http
GET /api/cart
Cookie: auth_token=xxx
```

### Sepete Ekle
```http
POST /api/cart
Content-Type: application/json
Cookie: auth_token=xxx

{
  "product_id": 5,
  "size": "42",
  "quantity": 1
}
```

### Sepetten Çıkar
```http
DELETE /api/cart?id=123
Cookie: auth_token=xxx
```

---

## ❤️ Favorites API

### Favorileri Getir
```http
GET /api/favorites
Cookie: auth_token=xxx
```

### Favorilere Ekle
```http
POST /api/favorites
Content-Type: application/json
Cookie: auth_token=xxx

{
  "product_id": 5
}
```

### Favorilerden Çıkar
```http
DELETE /api/favorites?product_id=5
Cookie: auth_token=xxx
```

---

## 📦 Orders API

### Siparişleri Getir
```http
GET /api/orders
Cookie: auth_token=xxx
```

### Sipariş Oluştur
```http
POST /api/orders
Content-Type: application/json
Cookie: auth_token=xxx

{
  "address_id": 1,
  "payment_method": "credit_card",
  "items": [
    {
      "product_id": 5,
      "size": "42",
      "quantity": 1
    }
  ]
}
```

---

## 📤 Upload API

### Görsel Yükle
```http
POST /api/upload
Content-Type: multipart/form-data

file: [image file]
```

**Response:**
```json
{
  "success": true,
  "url": "/uploads/1234567890_image.jpg",
  "filename": "1234567890_image.jpg",
  "size": 156789,
  "type": "image/jpeg"
}
```

---

## 🔑 Authentication

Tüm korumalı endpoint'ler `auth_token` cookie'si gerektirir. Token JWT formatındadır ve 7 gün geçerlidir.

### Token Yapısı
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "customer"
}
```

---

## ❌ Hata Kodları

| Kod | Anlamı |
|-----|--------|
| 400 | Bad Request - Geçersiz istek |
| 401 | Unauthorized - Yetkisiz erişim |
| 404 | Not Found - Kaynak bulunamadı |
| 500 | Internal Server Error - Sunucu hatası |

---

## 📝 Notlar

- Tüm tarihler ISO 8601 formatındadır
- Fiyatlar TL cinsindendir
- Görseller `/uploads` klasöründe saklanır
- Admin işlemleri için `role: 'admin'` gereklidir
