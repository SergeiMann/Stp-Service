# Структура проекта STP-Service

## 📁 Организация файлов

```
Stp-Service/
├── 📁 assets/                     # Статические ресурсы
│   ├── 📁 css/                    # CSS стили
│   │   └── styles.css             # Основные стили сайта
│   ├── 📁 js/                     # JavaScript файлы
│   │   ├── main.js                # Основной функционал сайта
│   │   ├── cart.js                # Функционал корзины
│   │   ├── catalog.js             # Функционал каталога
│   │   ├── checkout.js            # Функционал оформления заказа
│   │   └── contacts.js            # Функционал страницы контактов
│   ├── 📁 images/                 # Изображения
│   │   ├── 📁 brands/             # Логотипы брендов
│   │   │   ├── Zebra_id1_bzK6E2_1.svg
│   │   │   ├── honeywell-logo.svg
│   │   │   ├── datalogic.svg
│   │   │   ├── tsc.svg
│   │   │   ├── godex.svg
│   │   │   ├── bixolon_logo.svg
│   │   │   ├── bluebird.svg
│   │   │   ├── cipherlab.svg
│   │   │   ├── mertech.svg
│   │   │   ├── newland.svg
│   │   │   ├── Point Mobile_idJ74mvQeD_0.svg
│   │   │   ├── sato.svg
│   │   │   ├── sunlux.svg
│   │   │   ├── urovo.svg
│   │   │   └── ... другие бренды
│   │   ├── 📁 icons/              # Иконки
│   │   └── 📁 certs/              # Сертификаты
│   └── 📁 data/                   # Данные приложения
│       └── catalog-data.json      # Данные каталога товаров
├── 📁 src/                        # Исходный код
│   ├── 📁 pages/                  # HTML страницы (планируется)
│   └── 📁 components/             # Компоненты (планируется)
├── 📁 docs/                       # Документация
│   └── PROJECT_STRUCTURE.md      # Этот файл
├── 📄 index.html                  # Главная страница
├── 📄 about.html                  # Страница "О компании"
├── 📄 catalog.html                # Каталог товаров
├── 📄 checkout.html               # Оформление заказа
├── 📄 contacts.html               # Контакты
├── 📄 services.html               # Услуги
├── 📄 logo.svg                    # Логотип компании
└── 📄 README.md                   # Документация проекта
```

## 🎯 Принципы организации

### 1. **Разделение по типу ресурсов**
- `assets/css/` - все стили в одном месте
- `assets/js/` - JavaScript модули с четким разделением функций
- `assets/images/` - все изображения структурированы по категориям
- `assets/data/` - JSON данные и конфигурация

### 2. **Логическое группирование**
- Логотипы брендов собраны в `assets/images/brands/`
- Сертификаты в `assets/images/certs/`
- JavaScript разделен по функциональности:
  - `main.js` - общий функционал всего сайта
  - `cart.js` - функционал корзины
  - `catalog.js` - функционал каталога
  - `checkout.js` - оформление заказа
  - `contacts.js` - страница контактов

### 3. **Использование семантических имен**
- Файлы названы по их функции, а не местоположению
- Логотипы используют оригинальные названия из папки images

## 🔄 Обновленные пути

### CSS подключение:
```html
<link rel="stylesheet" href="assets/css/styles.css">
```

### JavaScript подключение:
```html
<script src="assets/js/main.js"></script>
<script src="assets/js/cart.js"></script>
```

### Логотипы брендов:
```html
<img src="assets/images/brands/Zebra_id1_bzK6E2_1.svg" alt="Zebra">
<img src="assets/images/brands/datalogic.svg" alt="Datalogic">
<img src="assets/images/brands/honeywell-logo.svg" alt="Honeywell">
```

### Данные каталога:
```javascript
fetch('assets/data/catalog-data.json')
```

## 📋 Функциональность логотипов

### Автоматическое определение логотипа по бренду:
JavaScript функция `getBrandLogo()` в каждом модуле автоматически определяет путь к логотипу:

```javascript
getBrandLogo(brand) {
    const brandMap = {
        'Zebra': 'assets/images/brands/Zebra_id1_bzK6E2_1.svg',
        'Honeywell': 'assets/images/brands/honeywell-logo.svg',
        'Datalogic': 'assets/images/brands/datalogic.svg',
        'TSC': 'assets/images/brands/tsc.svg',
        'Godex': 'assets/images/brands/godex.svg',
        // ... другие бренды
    };
    
    return brandMap[brand] || 'assets/images/brands/generic-logo.svg';
}
```

## ✅ Применение логотипов

Логотипы брендов интегрированы во все части сайта:

1. **Главная страница (`index.html`)**
   - Карточки услуг
   - Секция преимуществ

2. **Каталог (`catalog.html`)**
   - Карточки товаров (grid и list view)
   - Модальные окна товаров

3. **Корзина** 
   - Отображение товаров в корзине

4. **Оформление заказа (`checkout.html`)**
   - Сводка заказа

5. **Страница услуг (`services.html`)**
   - Секции поддерживаемых брендов

6. **Страница "О компании" (`about.html`)**
   - Навыки сотрудников
   - Сертификаты партнеров

## 🎨 CSS стилизация

Созданы специальные CSS классы для разных размеров логотипов:
- `.brand-logo-img` - основные логотипы в каталоге
- `.brand-logo-small` - средние логотипы в карточках услуг
- `.brand-logo-tiny` - маленькие логотипы в benefits
- `.service-brand-logo` - логотипы на странице услуг
- `.cart-brand-logo` - логотипы в корзине
- `.order-brand-logo` - логотипы в заказе

Все логотипы имеют:
- Адаптивные размеры
- Hover эффекты
- Фильтры grayscale с цветным hover
- Плавные анимации

## 🚀 Преимущества новой структуры

1. **Масштабируемость** - легко добавлять новые компоненты
2. **Поддержка** - код организован логически
3. **Производительность** - оптимизированные пути загрузки
4. **SEO** - семантическая структура URL
5. **Кэширование** - статические ресурсы в отдельных папках
