
## 🎯 Proje Hakkında

Bu proje, Hamming SEC-DED kodlarının nasıl çalıştığını görsel olarak öğrenmeyi ve test etmeyi sağlayan bir web simülatörüdür. Özellikle bilgisayar mühendisliği, elektrik-elektronik mühendisliği öğrencileri ve hata düzeltme kodları ile ilgilenen herkes için tasarlanmıştır.


## ✨ Özellikler

### 🎨 Kullanıcı Arayüzü
- Modern ve kullanıcı dostu tasarım
- Responsive design (mobil uyumlu)
- Görsel animasyonlar ve geri bildirimler
- Renkli bit kodlama sistemi

### 🔧 Fonksiyonel Özellikler
- **Çoklu Veri Boyutu:** 4, 8, 16 bit veri desteği
- **İnteraktif Kodlama:** Gerçek zamanlı Hamming kodu oluşturma
- **Hata Enjeksiyonu:** Seçilen bit pozisyonlarına hata ekleme
- **Otomatik Düzeltme:** Tek bit hatalarını otomatik düzeltme
- **Hata Tespiti:** Çift bit hatalarını tespit etme
- **Sendrom Analizi:** Gerçek zamanlı sendrom değeri hesaplama

### 📊 Görsel Gösterimler
- **Mavi bitler:** Veri bitleri
- **Turuncu bitler:** Parite bitleri
- **Kırmızı bitler:** Hatalı bitler (animasyonlu)
- **Bit etiketleri:** D1, D2... (veri), P1, P2... (parite)

## 🚀 Kullanım

### Adım 1: Veri Hazırlama
1. **Veri boyutunu seçin** (4, 8, veya 16 bit)
2. **Binary veri girin** (örn: `10110101`) veya **"Rastgele Üret"** butonunu kullanın
3. **"Kodla"** butonuna tıklayarak Hamming kodunu oluşturun

### Adım 2: Hata Enjeksiyonu
1. **Hata eklemek istediğiniz bit pozisyonlarını** alt panelden seçin
2. **"Hata Ekle"** butonuna tıklayın
3. **Sendrom değerini** gözlemleyin

### Adım 3: Hata Analizi ve Düzeltme
1. **"Hataları Düzelt"** butonuna tıklayın
2. **Sistem durumunu** status panelinden takip edin
3. **Sonuçları analiz edin:**
   - ✅ **Hata yok:** Syndrome = 000
   - ⚠️ **Tek bit hatası:** Düzeltilebilir
   - ❌ **Çift bit hatası:** Sadece tespit edilebilir

### Adım 4: Sıfırlama
- **"Sıfırla"** butonuyla simülasyonu yeniden başlatın

## 🧮 Hamming SEC-DED Kodu Nedir?

Hamming SEC-DED (Single Error Correcting, Double Error Detecting) kodu, veri iletimi ve saklama sistemlerinde kullanılan bir hata düzeltme kodudur.

### Temel Özellikler:
- **Tek Bit Hatası:** Otomatik olarak düzeltir
- **Çift Bit Hatası:** Tespit eder (düzeltemez)
- **Parite Bitleri:** Veri bitlerinin yanına eklenir
- **Sendrom:** Hata pozisyonunu belirler

### Uygulama Alanları:
- 💾 Bellek sistemleri (ECC RAM)
- 🛰️ Uzay uygulamaları
- 🔒 Kritik veri saklama sistemleri
- 📡 Veri iletişimi

## 🔧 Teknik Detaylar

### Algoritma
```javascript
// Parite bit sayısı hesaplama
function calculateParityBits(dataBits) {
    let parityBits = 0;
    while (Math.pow(2, parityBits) < dataBits + parityBits + 1) {
        parityBits++;
    }
    return parityBits;
}

// Sendrom hesaplama
function calculateSyndrome(received) {
    const parityBits = calculateParityBits(dataSize);
    let syndrome = 0;
    
    for (let i = 0; i < parityBits; i++) {
        const parityPos = Math.pow(2, i);
        let parity = 0;
        
        for (let j = 1; j < received.length; j++) {
            if ((j & parityPos) !== 0) {
                parity ^= received[j];
            }
        }
        
        if (parity !== 0) {
            syndrome += parityPos;
        }
    }
    
    return syndrome;
}
```

### Bit Organizasyonu
```
Pozisyon:  0  1  2  3  4  5  6  7  8  9 10 11 12
Tip:       P  P1 P2 D1 P4 D2 D3 D4 P8 D5 D6 D7 D8
```

- **P:** Genel parite biti (SEC-DED için)
- **P1, P2, P4, P8:** Parite bitleri
- **D1-D8:** Veri bitleri

## 📥 Kurulum

### Gereksinimler
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- JavaScript desteği

### Kurulum Adımları
1. **Dosyayı indirin:**
   ```bash
   git clone https://github.com/ncrim7/Hamming_Code.git
   ```

2. **Tarayıcıda açın:**
   - `hamming.html` dosyasını çift tıklayın
   - Veya tarayıcıya sürükleyin

3. **Kullanmaya başlayın!**

### Online Kullanım
Dosyayı herhangi bir web sunucusunda hosting edebilir veya GitHub Pages kullanabilirsiniz.

## 📸 Ekran Görüntüleri

### Ana Ekran
- Modern ve kullanıcı dostu arayüz
- Gradyan arka plan ve yumuşak animasyonlar

### Kodlama Görünümü
- Sol panel: Kodlanmış veri (gönderilen)
- Sağ panel: Alınan veri (hata ile)
- Alt panel: Hata enjeksiyon araçları

### Hata Analizi
- Renkli bit gösterimi
- Gerçek zamanlı sendrom hesaplama
- Durum mesajları ve öneriler

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak için:

1. **Fork** edin
2. **Feature branch** oluşturun (`git checkout -b feature/AmazingFeature`)
3. **Commit** edin (`git commit -m 'Add some AmazingFeature'`)
4. **Branch'e push** edin (`git push origin feature/AmazingFeature`)
5. **Pull Request** oluşturun

### Katkı Alanları
- 🐛 Bug düzeltmeleri
- ✨ Yeni özellikler
- 📚 Dokümantasyon iyileştirmeleri
- 🎨 UI/UX geliştirmeleri
- 🔧 Performance optimizasyonları

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.
