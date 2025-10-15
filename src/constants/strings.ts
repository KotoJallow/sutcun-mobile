import PaymentMethodsScreen from "../screens/PaymentMethodsScreen";

export default {
  // Screen Titles
  sutcun: 'Sütçün',
  homeTitle: 'Ana Sayfa',
  ordersTitle: 'Siparişlerim',
  accountTitle: 'Hesabım',
  addressManagement: 'Adres Yönetimi',
  login: "Giriş Yap",

  // Button Texts
  addToCart: 'Sepete Ekle',
  checkout: 'Ödeme Yap',
  confirm: 'Onayla',
  cancel: 'İptal',

  // Messages
  welcomeMessage: "Sütçün'e Hoş Geldiniz",
  emptyCart: 'Sepetiniz boş',
  orderSuccess: 'Siparişiniz başarıyla alındı',

  // Error Messages
  errorGeneral: 'Bir hata oluştu',
  errorConnection: 'İnternet bağlantınızı kontrol edin',

  // Placeholders
  searchPlaceholder: 'Ürün ara...',
  emailPlaceholder: 'E-posta adresiniz',

  // Additional Translations
  freshDairy: "Taze süt ürünleri kapınızda",
  change: "Adres Değiştir",
  deliverTo: "Teslimat Adresi",
  total: "Toplam",
  orderNumber: "Sipariş No",
  //loginOrSignUp: "Giriş Yap veya Kayıt Ol",
  enterPhone: "Giriş yapmak için telefon numaranızı giriniz",
  phoneNumber: "Telefon Numarası",
  continue: "Devam Et",
  verificationNote: "Bu numaraya doğrulama kodu göndereceğiz",
  termsText: "Devam ederek",
  termsService: "Kullanım Koşullarını",
  and: "ve",
  privacyPolicy: "Gizlilik Politikasını",
  acceptTerms: "kabul etmiş olursunuz",
  enterValidPhone: "Lütfen geçerli bir telefon numarası girin",

  // Register Screen
  register: "Kayıt Ol",
  fullName: "Ad",
  surname: "Soyad",
  verificationMessage: "Bu numaraya doğrulama kodu göndereceğiz",
  gender: "Cinsiyet",
  optional: "(opsiyonel)",
  selectGender: "Cinsiyetinizi seçin",
  birthDate: "Doğum Tarihi",
  selectBirthDate: "Doğum tarihinizi seçin",
  male: "Erkek",
  female: "Kadın",
  required: "*",
  termsAgreement: "Kullanım Koşulları ve Gizlilik Politikasını kabul ediyorum",
  createAccount: "Hesap Oluştur",
  selectGenderTitle: "Cinsiyet Seçin",

  // Validation Messages
  errorEnterName: "Lütfen adınızı girin",
  errorEnterSurname: "Lütfen soyadınızı girin",
  errorEnterValidPhone: "Lütfen geçerli bir telefon numarası girin",
  errorAcceptTerms: "Lütfen kullanım koşullarını ve gizlilik politikasını kabul edin",

  // Welcome Screen
  appSubtitle: "Taze süt ürünleri kapınızda",
  registerButtonText: "Hesap Oluştur",
  copyrightText: "© 2025 Sütçün. Tüm hakları saklıdır.",

  // Account Screen
  logoutTitle: 'Çıkış Yap',
  logoutMessage: 'Çıkış yapmak istediğinize emin misiniz?',
  logoutError: 'Çıkış yapılamadı. Lütfen tekrar deneyin.',
  defaultUserName: 'Kullanıcı',
  notProvided: 'Belirtilmemiş',
  verifiedAccount: 'Doğrulanmış Hesap',

  // Menu Items
  myOrders: 'Siparişlerim',
  myAddresses: 'Adreslerim',
  paymentMethods: 'Ödeme Yöntemleri',
  contactSupport: 'Destek',
  appSettings: 'Uygulama Ayarları',

  // Adres Ekleme Ekranı
  addAddress: 'Yeni Adres Ekle',
  selectDistrict: 'İlçe seçiniz',
  selectNeighborhood: 'Mahalle seçiniz',
  streetAddress: 'Cadde / Sokak',
  buildingNumber: 'Bina No',
  floorNumber: 'Kat',
  apartmentNumber: 'Daire No',
  addressDirections: 'Adres Tarifi',
  addressDirectionsExample: 'Örn: Taksi durağının karşısı',
  addressDetails: 'Adres Detayları',
  addressTitle: 'Adres Başlığı',
  saveAddress: 'Kaydet',
  homeAddress: 'Ev',
  workAddress: 'İş',
  otherAddress: 'Diğer',
  
  // Hata Mesajları
  errorSelectDistrict: 'Lütfen ilçe seçiniz',
  errorSelectNeighborhood: 'Lütfen mahalle seçiniz',
  errorEnterStreet: 'Lütfen cadde/sokak giriniz',
  errorEnterBuilding: 'Lütfen bina numarası giriniz',
  errorEnterFloor: 'Lütfen kat numarası giriniz',
  errorEnterApartment: 'Lütfen daire numarası giriniz',
  errorEnterTitle: 'Lütfen adres başlığı giriniz',
  errorUserNotFound: 'Kullanıcı bulunamadı. Lütfen kayıt olun veya giriş yapın.',
  errorSaveAddress: 'Adres kaydedilemedi. Lütfen tekrar deneyin.',

  // Hesabım altındaki Ekranlar
  appSettingsScreen: 'Uygulama Ayarları Ekranı',
  contactSupportScreen: 'İletişim Destek Ekranı',
  PaymentMethodsScreen: 'Ödeme Yöntemleri burada listelenecektir.',

  // Orders Screen
  noOrders: 'Henüz sipariş yok',
  ordersWillAppear: 'Siparişleriniz burada görünecek',
  errorLoadingOrders: 'Siparişler yüklenirken hata oluştu',
  tryAgainLater: 'Lütfen daha sonra tekrar deneyin',
  errorLoadingOrder: 'Sipariş yüklenirken hata oluştu',
  noItems: 'Ürün yok',
  errorLoadingItems: 'Ürünler yüklenirken hata oluştu',

  // OTP Screen
  otpTitle: '6 haneli kodu giriniz',
  otpSubtitle: 'Telefon numaranıza bir kod gönderdik',
  verify: 'Doğrula',
  resendCode: 'Kodu Tekrar Gönder',
  sendingCode: 'Doğrulama kodu gönderiliyor...',
  verificationError: 'Doğrulama Hatası',
  noVerificationId: 'Doğrulama kodu bulunamadı. Lütfen kodu tekrar gönderiniz.',
  welcome: 'Hoş Geldiniz!',
  firstTimeMessage: 'İlk girişiniz olduğu için Beylikdüzü/Kavaklı bölgesindeki ürünleri göstereceğiz. Adresinizi daha sonra ekleyebilirsiniz.',
  ok: 'Tamam',

  // Cart Screen
  cart: 'Sepet',
  clearCart: 'Sepeti Temizle',
  clearCartConfirm: 'Sepetinizi temizlemek istediğinize emin misiniz?',
  orderConfirm: 'Siparişi Onayla',
  checkOrderDetails: 'Sipariş detaylarını kontrol edin',
  itemCount: 'ürün',
  deliveryAddress: 'Teslimat Adresi',
  deliveryTime: 'Teslimat Saati',
  payment: 'Ödeme',
  cashOnDelivery: 'Kapıda Ödeme',
  totalAmount: 'Toplam Tutar',
  createOrder: 'Siparişi Oluştur',
  retry: 'Tekrar Dene',

  // Cart Error Messages
  error: 'Hata',
  warning: 'Uyarı',
  selectTimeWarning: 'Lütfen teslimat saati seçiniz.',
  emptyCartError: 'Sepetiniz boş. Lütfen sipariş vermeden önce ürün ekleyin.',
  authError: 'Kullanıcı girişi yapılmamış. Lütfen tekrar giriş yapın.',
  addressError: 'Lütfen sipariş vermeden önce geçerli bir teslimat adresi ekleyin.',
  orderError: 'Sipariş oluşturulamadı.',
  connectionError: 'Lütfen internet bağlantınızı kontrol edip tekrar deneyin.',
  databaseError: 'Siparişinizi kaydederken bir sorun oluştu. Lütfen tekrar deneyin.',
  cartError: 'Sepetinizdeki ürünlerle ilgili bir sorun oluştu. Lütfen sayfayı yenileyip tekrar deneyin.',
  
  // Success Messages
  orderSuccessText: 'Sipariş Onaylandı!',
  orderSuccessMessage: 'Siparişiniz başarıyla alındı. Siparişlerim bölümünden takip edebilirsiniz.',
  productCount: 'Ürün Sayısı',
  defaultTitle: 'Varsayılan',
  defaultStreet: 'Varsayılan Sokak',
  defaultAddress: 'Varsayılan adres',
  authenticationError: 'Kimlik Doğrulama Hatası',
  orderFailed: 'Sipariş Oluşturulamadı',
  unableToCreateOrder: 'Sipariş oluşturulamadı. Lütfen tekrar deneyin.',
  validDeliveryAddress: 'Lütfen sipariş vermeden önce geçerli bir teslimat adresi ekleyin.',
  retryButton: 'Tekrar Dene',

    // Product Card
  addressRequired: 'Adres Gerekli',
  addressBeforeCart: 'Ürünleri sepete eklemeden önce bir adres eklemeniz gerekmektedir. Şimdi adres eklemek ister misiniz?',
  success: 'Başarılı',
  addedToCart: 'sepete eklendi!'
}