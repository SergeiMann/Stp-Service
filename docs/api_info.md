Описание системы обмена данными (API)между ThinkLink и партнерами
Оглавление
Введение	1
Правила организации взаимодействия	1
Ограничения в части работы с сервисом	2
Основные функции	2
Работа с сервисом	2
Методы API	3
Каталог товаров	3
Товары	3
Цены	4
Промо-товары	5
Остатки	5
Курсы валют	6
Заказы	7
Контракты	7
Товары в заказе	7
Оформление заказа	9
Информация о заказе	9
Список всех заказов	9

Введение
В данном документе приведено описание API ThinkLink.

Правила организации взаимодействия
Для использования API Thibklink необходимо:
•	Пройти процедуру регистрации для получения логина и пароля (токена);
•	Предоставить фиксированный список IP адресов, с которых будет разрешено использование API ThinkLink;
•	Партнер обязательно должен иметь право доступа к системе ThinkLink с определенными в ней настройками.
Ограничения в части работы с сервисом
Предельное количество запросов в минуту – 20, в час 1000, в сутки 10000. Кол-во сделанных запросов можно уточнить на странице настроек API https://thinklink.ru/user/subscriptions/tab-7 .

Основные функции
•	Получение информации о товарных группах
•	Получение информации о наличии товаров и ценах на товар
•	Получение информации о промо товарах
•	Создание заказов

Работа с сервисом
Для того чтобы получить данные, необходимо отправить GET или POST запрос по адресу 
https://thinklink.ru/api/{{method}}
С обязательными параметрами: "login": (string), "token": (string).
Пример:
curl ‘https://thinklink.ru/api/items?login={{login}}&token={{token}}’
Ответ имеет формат JSON строки в следующем формате
{
	"OperationStatus":"OK",
	"ErrorText":"",
	"ErrorDetails":"",
	"EffectiveDate":"2019-04-03 11:01:00",
	"Result":""
}
Если, при обработке запроса, произойдет ошибка, то вернется ее статус и описание.
Возможные статусы ошибок:
'BAD_LOGIN' – неправильный формат параметров авторизации 
'AUTH_FAILED' – авторизация не прошла
'IP_FAILED' – нет доступа для IP адреса, необходимо зарегистрировать IP адрес на странице настроек API
'MAX_REQUEST_MINUTE' – достигнуть лимит на кол-во обращений в минуту
'MAX_REQUEST_HOUR' – достигнуть лимит на кол-во обращений в час
'MAX_REQUEST_DAY' – достигнуть лимит на кол-во обращений в день
'API_INACTIVE' – выключена поддержка API для данного пользователя на странице настроек API
'BAD_PARAMS' – неверный формат дополнительных параметров
'INNER_ERROR' – внутренняя ошибка. 
'ORDER_BAD_ITEMS' – неверно указаны данные о товарах в заказе
'ORDER_BAD_ID' – неверно указан id заказа
'ORDER_NOT_EDITABLE' – заказ нельзя редактировать,
'ORDER_SUBMITED' – заказ уже оформлен
'ORDER_BAD_END_USER' – неверно указана информация о конечном пользователе
'ORDER_BAD_CONTRACT' - неверно указана информация о контракте;

Результат выполнения имеет следующий формат
"Result":{
	"current_page": (int),
	"data": [{},{}],
	"from": (int),
	"last_page": (int),
	"to": (int),
	"total": (int)
}

Данные выдаются страницами, по 500 записей. Ответ содержит:
	номер страницы с данными (current_page), начиная с 1; 
	массив с данными (data); 
	начальный номер данных, передаваемый на текущей странице (from), начиная с 1;
	конечный номер данных, передаваемый на текущей странице (to);
	общие количество данных (total)
	номер последней страницы с данными (last_page)

Для того чтобы получить данные для страницы, необходимо указать номер страницы в качестве дополнительного параметра page:(int), начиная с 1. Если данный параметр не указан возвращается первая страница.

Пример:
curl ‘https://thinklink.ru/api/items?login={{login}}&token={{token}}&page=4’

Методы API
Каталог товаров
Метод возвращает полное трехуровневое дерево товарных категорий.
Название метода: catalog
Пример:
curl ‘https://thinklink.ru/api/catalog?login={{login}}&token={{token}}&page=4’
Формат возвращаемых данных data:
{
	"level": (int),
	"sourceId": (int),
	"parentId": (int),
	"name": (string)
}
, где level – уровень каталога, может быть равен 1,2 или 3; sourceId – уникальный код уровня; parentId – код уровня родителя, для элементов первого уровня (level=1), parentId=0; name – название уровня

Товары
Метод возвращает полной список доступных товаров.
Название метода: items
Можно выгрузить как все товары, так и товары какой-то одной категории, для этого дополнительно необходимо указать уровень каталога (level) и его id (catId).
В качестве дополнительных параметров можно указать:
•	(includeBrand=1), в результат к описанию товара будет добавлено описание бренда товара, состоящего из кода бренда (“brand.code”) и названия (“brand.tl_name”)
•	(onlyAvailable) равный 1, если он указан, то выгрузятся только товары с ненулевам остатком на складе (onlyAvailable=1)

Пример:
curl ‘https://thinklink.ru/api/ items?login={{login}}&token={{token}}&page=4’
curl ‘https://thinklink.ru/api/ items?login={{login}}&token={{token}}&level =2&catId=1424’
curl ‘https://thinklink.ru/api/ items?login={{login}}&token={{token}}&includeBrand=1’

Формат возвращаемых данных data:
{
	"itemId": (string),
	"itemName": (string),
	"CatalogueLevel1": (int),
	"CatalogueLevel2": (int),
	"CatalogueLevel3": (int),
	"IsEndUserRequired": (int),
	"VendorPartnumber": (string),
	"brand":
		{
			"code": (string),
			"tl_name": (string)
		}

}
, где itemId – уникальный код товара; itemName – описание товара; CatalogueLevel1 – id 1 уровня каталога в котором находится товар; CatalogueLevel2 – id 2 уровня каталога в котором находится товар; CatalogueLevel3 – id 3 уровня каталога в котором находится товар; IsEndUserRequired – свойство указывающие на необходимость указания конечного покупателя при размещении заказа на этот товар (1 или 0); VendorPartnumber – код производителя товара (он не является уникальным!); brand – описание бренда товара, передается, только в том случаи, если в запросе указан параметр (includeBrand=1).

Цены
Метод возвращает полной список цен товаров.
Внимание! Данный метод возвращает только цены по обычным товарам. Данные по промо-товарам, получаются отдельно (см. раздел промо-товары).
Название метода: price
Можно выгрузить как все цены, так и цены какой-то одно категории, для этого дополнительно необходимо указать уровень каталога (level) и его id (catId). В качестве дополнительных параметров можно указать: 
•	(itemId), строка, содержащая itemId или его часть, в результат попадут все товары, у которых есть включения данного параметра в itemId. Минимальная длина параметра (itemId) 4 символа;
•	(withDescription) равный 1, если он указан, то в выгрузке будет передаваться название товара (itemName).
•	(onlyAvailable) равный 1, если он указан, то выгрузятся только товары с ненулевым остатком на складе (onlyAvailable=1)


Пример:
curl ‘https://thinklink.ru/api/price?login={{login}}&token={{token}}&page=4’
curl ‘https://thinklink.ru/api/price?login={{login}}&token={{token}}&level =2&catId=1424’
curl ‘https://thinklink.ru/api/price?login={{login}}&token={{token}}&itemId=2500&withDescription=1’

Формат возвращаемых данных data:
{
	"itemId": (string),
	"currency": (string),
	"IsGPLPrice": (int),
	"price": (double)
}
, где itemId – уникальный код товара; currency – код валюты цены, возможные значения (“USD”, “EUR”, “RUR”); IsGPLPrice – свойство указывающие цена GPL или нет (1 или 0); price – значение цены.

Промо-товары
Метод возвращает полной список промо-товаров, их остатки и цены. Промо-товары доступны только к заказу на сайте, через API данные товары невозможно заказать по промо ценам. По определенным брендам, доступна только информация об остатках. Цены по данным товарам, можно узнать только на сайте.
Название метода: promo
Можно выгрузить только полный список данных по промо-товарам.


Пример:
curl ‘https://thinklink.ru/api/promo?login={{login}}&token={{token}}’
Формат возвращаемых данных data:
{
	"itemId": (string),
	"PostedQty": (int),
	"Price": (double),
	"Currency": (string)
}
, где itemId – уникальный код товара; currency – код валюты цены, возможные значения (“USD”, “EUR”, “RUR”); PostedQty – доступное кол-во, Price – цена. Если значение цены равно 0, это означает, что ее можно узнать только на сайте.

Остатки
Метод возвращает список товаров, по которым известен остаток на складе.
Название метода: qty
Можно выгрузить как все остатки, так и в какой-то одной категории, для этого дополнительно необходимо указать уровень каталога (level) и его id (catId). В качестве дополнительных параметров можно указать:
•	(itemId), строка, содержащая itemId или его часть, в результат попадут все товары, у которых есть включения данного параметра в itemId. Минимальная длина параметра (itemId) 4 символа; 
•	(onlyAvailable) равный 1, если он указан, то выгрузятся только товары с ненулевам остатком на складе (onlyAvailable=1)
•	(withDescription) равный 1, если он указа, то в выгрузке будет передаваться название товара (itemName).
•	

Пример:
curl ‘https://thinklink.ru/api/qty?login={{login}}&token={{token}}&page=4’
curl ‘https://thinklink.ru/api/qty?login={{login}}&token={{token}}&level =2&catId=1424’
curl ‘https://thinklink.ru/api/qty?login={{login}}&token={{token}}&itemId=2500’
curl ‘https://thinklink.ru/api/qty?login={{login}}&token={{token}}& onlyAvailable=1& withDescription=1’

Формат возвращаемых данных data:
{
	"itemId": (string),
	"qty": (int)
}
, где itemId – уникальный код товара; qty – остаток на складе. 

Курсы валют
Метод возвращает список актуальных курсов валют.
Название метода: rates
Пример:
curl ‘https://thinklink.ru/api/rates?login={{login}}&token={{token}}’

Формат возвращаемых данных data:
{
	"RUR_EUR": (double),
	"EUR_RUR": (double),
	"RUR_USD": (double),
	"USD_RUR": (double),
	"EUR_USD": (double),
	"USD_EUR": (double)
}

 
Заказы
Оформление заказов через API происходит в 2 этапа. На первом этапе добавляются товары в заказ. На втором этапе происходит оформление заказа с указанием необходимых данных.
Внимание! Промо-товары возможно оформить только через сайт. 
Одновременно можно формировать только один заказ.
Пример:
1.	Получить информацию о товарах 
curl ‘https://thinklink.ru/api/ items?login={{login}}&token={{token}}&page=1’
2.	Получить информацию о ценах
curl ‘https://thinklink.ru/api/price?login={{login}}&token={{token}}&itemId=2500&withDescription=1’
3.	Получить информацию об остатках (если товара нет на складе в данный момент, его все равно можно добавить в заказ, при этом сроки доствки можно будет уточнить у менеджера)
curl ‘https://thinklink.ru/api/qty?login={{login}}&token={{token}}&itemId=2500’
4.	Добавить выбранный товар в корзину
curl ‘https://thinklink.ru/api/ orderItems?login={{login}}&token={{token}}&orderId=200070&items[0][itemId]=AV194181&items[0][qty]=2&items[1][itemId]=AV203990&items[1][qty]=4’
В ответ сервис отдает детали созданного заказа, в поле orderId содержится уникальный id заказа. Далее можно добавлять товары к этому заказу и изменять кол-ва уже добавленных товаров в заказе, указав id заказа.
5.	Для оформления заказа, необходимо указать контракт, по которому будет оформлен заказ. Для заказа можно указать только один контракт. Получить список доступных контрактов
curl ‘https://thinklink.ru/api/contracts?login={{login}}&token={{token}}’
6.	Размещение заказа
сurl ‘https://thinklink.ru/api/orderSubmit?login={{login}}&token={{token}}&orderId=200070&ContractId=SPBC011690’
Формат возвращаемых данных data:
{
“ContractId”: (string),
“PaymTermId”: (string),
“billTo_name”: (string),
“billTo_inn”: (string),
“billTo_city”: (string),
“billTo_address”: (string),
“shipTo_name”: (string),
“shipTo_inn”: (string),
“shipTo_city”: (string),
“shipTo_address”: (string),
}
, где ContractId – уникальный id контракта, PaymTermId – условия оплаты, billTo_name – название компании плательщика, billTo_inn – ИНН компании плательщика, billTo_city – город компании плательщика, shipTo_address – адрес компании грузополучателя, shipTo_inn – ИНН компании грузополучателя, shipTo_city – город компании грузополучателя, shipTo_address – адрес компании грузополучателя.

Товары в заказе
Метод для добавления и удаления товаров в заказе.
Название метода: orderItems

Обязательные параметры: массив товаров items, который должен содержать id товара itemId и количество qty. Если qty равно 0, то товар будет удален из заказа.
Так можно указать id существующего заказа в свойстве orderId, для добавления или удаления товаров. В этом случае заказ должен быть не оформлен.

Пример:
curl ‘https://thinklink.ru/api/ orderItems?login={{login}}&token={{token}}&orderId=200070&items[0][itemId]=AV194181&items[0][qty]=2&items[1][itemId]=AV203990&items[1][qty]=4’

В качестве ответа возвращается описание заказа.

Формат возвращаемых данных data:
{
	"orderId": (int),
	"status": (int),
	"currency": (string),
	"total": (double),
	"ContractId": (string),
"isEnd": (bool),
	"isEndFull": (bool),
	"EndUserCompany": (string),
"EndUserInn": (string),
"EndUserCity": (string),
"EndUserAddress": (string),
"EndUserEmail": (string),
"EndUserPhone": (string),
"EndUserContactPerson": (string),
"EndUserContactPersonJobTitle": (string),
"items":
[
	{
		"itemId": (string),
		"itemName": (string),
		"qty": (int),
		"price": (double),
		"is_end": (bool)
	}, 
	{...}
],

}
Где orderId – уникальный id заказа, status – статус заказа, может принимать следующие значения:
2 – заказ открыт,
3 – заказ отправлен,
4 – заказ в обработке,
5 – заказ выполнен
, currency – валюта в которой создан заказ может принимать значения: «RUR», «USD», «EUR», определяется валютой мастер аккаунта, total – общая сумма заказа, ContractId – id контракта заказа,  isEnd – свойство, определяющие необходимость указывать данные конечного покупателя (EndUserCompany, EndUserInn, EndUserCity) при оформлении заказа, isEndFull – свойство, определяющие необходимость указывать полные данные конечного покупателя (EndUserCompany, EndUserInn, EndUserAddress, EndUserEmail, EndUserPhone, EndUserContactPerson, EndUserContactPersonJobTitle) при оформлении заказа, items – массив товаров, содержит данные о id товара itemId, количестве qty, цене price в валюте заказа и свойство is_end указывающие, что для данного заказа необходимо указывать данные о конечном пользователе. Если для товаров необходимо указывать информацию о конечном пользователе, то в одном заказе могут быть только товары для одного конечного пользователя. 

Оформление заказа
Метод для оформления заказа.
Название метода: orderSubmit

Обязательные параметры: orderId id заказа, ContractId id контракта.
Если для заказа необходимо указать данные о конечном пользователе (isEnd=true) необходимо указать EndUserCompany, EndUserInn, EndUserCity. 
Если для заказа необходимо указать полные данные о конечном пользователе (isEndFull =true) необходимо указать следующие параметры EndUserCompany, EndUserInn, EndUserAddress, EndUserEmail, EndUserPhone, EndUserContactPerson, EndUserContactPersonJobTitle. 

Пример:
Curl ‘https://thinklink.ru/api/orderSubmit?login={{login}}&token={{token}}&
orderId=200070&ContractId=SPBC011690’
Curl ‘https://thinklink.ru/api/orderSubmit?login={{login}}&token={{token}}&
orderId=200070&ContractId=SPBC011690&EndUserCompany=B2BTEST&EndUserInn=7729773587&EndUserCity=Москва’

В качестве ответа возвращается описание заказа.

Информация о заказе
Метод для получения информации о заказе.
Название метода: orderDetails

Обязательные параметры: orderId id заказа. 

Пример:
Curl ‘https://thinklink.ru/api/orderDetails?login={{login}}&token={{token}}&
orderId=200070’

В качестве ответа возвращается описание заказа.

Список всех заказов
Метод возвращает список всех заказов.
Название метода: orders

Пример:
curl ‘https://thinklink.ru/api/orders?login={{login}}&token={{token}}&page=4’

Формат возвращаемых данных data:
{
	"id": (int),
	"status": (int),
	"currency": (string),
	"total": (double),
	"created_at": (date)
}
, где Id – уникальный id заказа, status – статус заказа, может принимать следующие значения:
2 – заказ открыт,
3 – заказ отправлен,
4 – заказ в обработке,
5 – заказ выполнен
, currency – валюта в которой создан заказ, total – общая сумма заказа, created_at – дата создания заказа в формате “YYYY-MM-DD HH:MM`:SS”

