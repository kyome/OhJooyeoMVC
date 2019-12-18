# OhJooYeo API 문서

본 문서는 오주여 프로젝트의 REST API 정의 문서를 정리해 놓은 문서이다. 

반드시 멤버들 간의 협의를 거쳐 통과한 내용만 수정해서 반영해야한다.

**Current Version: v 0.2.0 (19.10.08)**

----

## - REST API Option

- **Base URL**

```
http://aaaicu.synology.me:8088/OhJooYeoMVC
```

- **Return Type에 별도의 표기 없이 Example만 적었다면 모두 String 타입이다.**


----

## - API List


`[Enabled]`
### [1] _POST_ /worship/list

1) Description

```
현재 주보 정보가 있는 날짜와 worship id에 대한 리스트 정보를 불러온다.
```

2) Headers

```
Content-Type: application/json
```

3) Body

```
{
    "churchId": 13  (교회 ID)
}
```

4) Response Data

```
[{
    "date": "주보 정보가 있는 날짜" [String],
    "worshipId": "예배 별 ID 값" [String]
}]
```

5) Back-End Info

```
* Controller
WorshipController.worshipList(Map<String, String> reqMap) : List<Map<String, String>>
  
	- WorshipService.getWorshipList(String churchId) : List<Map<String, String>>
		
		>> Data <<
		WorshipDAO.getWorshipList(String churchId) : List<Map<String, String>>
		* SQL : worship.getWorshipIdList
	

```


----


`[Enabled]`
### [2] _POST_ /worship/info


1) Description

```
현재 worship id에 해당하는 최신버전의 예배 순서를 가져온다.
```

2) Headers

```
Content-Type: application/json
```

3) Body

```
{
    "churchId": 13,  (교회 ID)
    "worshipId": "19-001", (예배 ID)
    "version": 3 (광고 버전)
}
```

4) Response Data

- 응답이 null일 경우는 최신데이터임.

```
{
    "mainPresenter": "인도자 이름" [String],
    "worshipOrder": [{
    	 "type" : 순서의 특징을 나타내는 타입 [String],
        "title": "순서1 - 순서 1에 해당하는 제목" [String],
        "detail": "순서1 - 순서 1에 해당하는 상세 항목" [String],
        "presenter": "순서1 - 순서 1에 해당하는 대표자" [String],
        "standupYn" : 순서에서 성도가 일어서는지 여부 [Int],
        "order": 예배 순서 [Int],
        "orderId": 각 순서에 대한 식별값ID 정보 [Int]
    }],
    "nextPresenter": {
        "mainPresenter":"다음주 인도자 이름" [String],
        "prayer":"다음주 기도자 이름" [String],
        "offer":"다음주 헌금위원 이름 [String]"
    },
    "version": 예배 순서 정보의 버전 [Int]
}
```


- Category Enum Values

```
type Enum 
0: "일반순서"
1: "성경봉독"
2: "찬양"
```

```
standupYn Enum
0: "앉아있기"
1: "일어서기"
```

- Response Example

```
{
    "nextPresenter": {
        "offer": "서동주",
        "prayer": "박요한",
        "mainPresenter": "김한나"
    },
    "mainPresenter": "박요한",
    "worshipOrder": [{
	        "type": 2,
	        "standupYn": 0,
	        "presenter": "회중",
	        "title": "경배와찬양",
	        "order": 1
	    },
	    {
	        "type": 0,
	        "standupYn": 0,
	        "presenter": "정애림",
	        "title": "기도",
	        "order": 2
	    },
	    {
	        "type": 1,
	        "standupYn": 1,
	        "presenter": "인도자",
	        "detail": "욘 2:7-2:10/고전 2:1-3:1",
	        "title": "성경봉독",
	        "order": 3
	    },
	    {
	        "type": 0,
	        "standupYn": 0,
	        "presenter": "김희선전도사님",
	        "detail": "감사의 노래",
	        "title": "설교",
	        "order": 4
	    },
	    {
	        "type": 0,
	        "standupYn": 1,
	        "presenter": "표준범",
	        "detail": "",
	        "title": "헌금",
	        "order": 5
	    },
	    {
	        "type": 0,
	        "standupYn": 1,
	        "presenter": "설교자",
	        "detail": "",
	        "title": "헌금기도",
	        "order": 6
	    },
	    {
	        "type": 0,
	        "standupYn": 0,
	        "presenter": "인도자",
	        "detail": "",
	        "title": "성도의교제",
	        "order": 7
	    },
	    {
	        "type": 2,
	        "standupYn": 0,
	        "presenter": "회중",
	        "detail": "",
	        "title": "파송찬양",
	        "order": 8
	    },
	    {
	        "type": 0,
	        "standupYn": 1,
	        "presenter": "회중",
	        "detail": "",
	        "title": "주기도문",
	        "order": 9
	    }],
    "version": 1
}
```

- Response Description

```
{}이 반환되었다면 현재 값이 최신버전인 것이다.
```


5) Back-End Info

```
* Controller
WorshipController.worshipInfo(Map<String, String> reqMap) : Map<String, Object>
  
	- WorshipService.getWorshipOrder(String churchId, String worshipId,Map<String, Object> info) : Map<String,Object>
		
		>> Data <<
		OrderDAO.getWorshipOrder(String churchId, String worshipId) : List<Map<String, Object>>
		* SQL : worship.getWorshipOrder
		
		
	- WorshipService.getWorshipMc(String churchId, String worshipId, Map<String, Object> info) : Map<String, Object>

		>> Data <<
		WorshipDAO.getWorshipInfo(String worshipId) : Map<String, String>
		* SQL : worship.getWorshipMap
		
```
----



`[Enabled]`
### [3] _POST_ /worship/add


1) Description

```
worship데이터를 추가한다
```

2) Headers

```
Content-Type: application/json
```

3) Body

```
{
	worshipInfo : {
		"churchId" : "교회에 대한 식별 ID" [Int],
		"worshipDate" : "예배 날짜" [String],
		"mainPresenter" : "사회자" [String],
		"nextPresenter" : "다음 사회자" [String],
		"nextPrayer" : "다음 기도자" [String],
		"nextOffer" : "다음 봉헌자" [String] 
	},
	
	worshipOrder : 
	[{
    	 "type" : 순서의 특징을 나타내는 타입 [String],
        "title": "순서1 - 순서 1에 해당하는 제목" [String],
        "detail": "순서1 - 순서 1에 해당하는 상세 항목" [String],
        "presenter": "순서1 - 순서 1에 해당하는 대표자" [String],
        "standupYn" : 순서에서 성도가 일어서는지 여부 [Int],
        "order": 예배 순서 [Int],
        "orderId": 각 순서에 대한 식별값ID 정보 [Int]
    }],
    
	worshipAd : 
    [{
        "title": "광고1 - 광고 1에 해당하는 제목" [String],
        "content": "광고1 - 광고 1에 해당하는 내용" [String],
        "order": 광고순서 [Int] ,
        "adId": 각 광고에 대한 식별값ID 정보 [Int]
     }]
}
```


4) Response Data

- 성공시, 예배의 ID[String]를 반환

- 실패시, "" 공백데이터 반환

```
새롭게 추가된 예배ID

```




- Response Example


```
19-002
```

5) Back-End Info

```
* Controller
WorshipController.worshipAdd( Map<String,Object> worship) : String
  
	- worshipService.getNewWorshipId(String churchId) : String
		worshipService.getLastWorshipId(String churchId) : String
		
			>> Util <<
			WorshipIdGenerator 사용
		
		
	- WorshipService.addWorship(WorshipVO worshipVO) : boolean

		>> Data <<
		WorshipDAO.insertWorship(WorshipVO worshipVO) : int
		* SQL : worship.insertWorship


	- OrderService.addWorshipOrder(int churchId, String worshipId , List<Map<String,Object>> list) : boolean

		>> Data <<
		OrderDAO.insertVOList(List<WorshipOrderVO> list) : int
		* SQL : order.insertVOList
		
		
	- AdvertisementService.addWorshipAd(int churchId, String worshipId , List<Map<String,Object>> list) : boolean

		>> Data <<
		advertisementDAO.insertVOList(List<WorshipOrderVO> list) : int
		* SQL : advertisement.insertVOList

	
	
```

----


`[Enabled]`
### [4] _delete_ /worship/delete


1) Description

```
worship데이터를 삭제한다
```

2) Headers

```
Content-Type: application/json
```

3) Body

```
{
    "churchId": 1,
    "worshipId": "19-004"
}
```


4) Response Data

- 성공시, true 반환

- 실패시, false 반환

- Response Example


```
true
```

5) Back-End Info

```
* Controller
WorshipController.worshipDelete(@RequestBody Map<String,String> map) : boolean
  
	- orderService.deleteWorshipOrder(map) : int
		>> Data <<
		orderDAO.deleteWorshipOrder(Map<String,String> map) : int
		* SQL : order.deleteWorshipOrder
		
  
	- adService.deleteWorshipAd(map) : int
		>> Data <<
		advertisementDAO.deleteWorshipAd(Map<String,String> map) : int
		* SQL : advertisement.deleteWorshipAd		
		
	- worshipService.deleteWorship(map) : int
		>> Data <<
		worshipDAO.deleteWorship(Map<String,String> map) : int
		* SQL : worship.deleteWorship
	
```



----

`[Enabled]`
### [3] _ POST_ /phrase

1) Description

```
주보 순서지에 해당하는 말씀 내용을 불러온다. Request Parameter에 포함된 phrase에 해당하는 말씀을 Response 받는다.
```

2) Headers

```
Content-Type: application/json
```

3) Body

```
{
    "phraseRange": [ 
        "성경 a:b(-a:b)(/성경 a:b(-a:b))" [String],
        "창세기 1:1(-1:3)(/출애굽기 1:2(-1:4))" [String],
        ...
    ]
}
```

4) Response Data

```
[
    [
        {
            "phrase":"창 1:3",
            "contents":"말씀내용"
        },
        {
            "phrase":"창 1:4",
            "contents":"말씀내용"
        },
        ...
    ],
    [
        {
            "phrase":"창 1:3",
            "contents":"말씀내용"
        },
        {
            "phrase":"창 1:4",
            "contents":"말씀내용"
        },
        ...
    ],
    ...
]
```
 
----

### [4] _POST_ /signin

1) Description

```
로그인 API
```

2) Headers

```
Content-Type: application/json

```

3) Body

```
{
    "id": "admin",
    "pw": "admin"
}
```

4) Response Data

```
{
	"churchId"
}
```

### [5] _POST_ /launch

1) Description

```
올해의 말씀 API
```

2) Headers

```
Content-Type: application/json

```

3) Body

```
{
    "churchId": 13  (교회 ID)
}
```

4) Response Data

```
{
    "yearlyPhrase": "~~~~~~~~~~~~~~" [String]
}
```



### [6] _POST_ /notice/list

1) Description

```
공지사항 API
```

2) Headers

```
Content-Type: application/json

```

3) Body

```
{
    "churchId": 13,  (교회 ID)
    "noticeId": 10   (불러온 게시판 마지막글의 noticeId - 0일경우 가장 처음 호출)
}
```

4) Response Data

- 응답이 null일 경우는 최신데이터임.

```
[{
	 "noticeId": 1,
    "title": "공지사항1",
    "content": "공지내용1",
    "regDate": "2019-09-09",
    "userId": "admin(작성자)",
    "order": 1,
},
{
	 "noticeId": 2,
    "title": "공지사항2",
    "content": "공지내용2",
    "regDate": "2019-09-13",
    "userId": "admin(작성자)",
    "order": 2,
},
{
	 "noticeId": 3,
    "title": "공지사항3",
    "content": "공지내용3",
    "regDate": "2019-09-18",
    "userId": "admin(작성자)",
    "order": 3,
}]
```
