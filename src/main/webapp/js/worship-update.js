
console.log();

[].forEach.call(document.querySelectorAll('#worship-info-area input.change-check'),function (e){
	e.addEventListener('change',function (element) {
		document.querySelector('#worship-info-area').dataset['updateYn']="1";
	});
});

document.getElementById('updateButton').addEventListener('click',function (e) {
	let paramObject;

	let worshipObject = {};
	let orderList = [];
	let addOrderList = [];
	let adList = [];
	let addAdList = [];
	
	if(document.querySelector('#worship-info-area').dataset['updateYn']==="1"){
		[].forEach.call(document.querySelectorAll('#worship-info-area input.change-check'),function (e){
			worshipObject[e.name] = e.value;
		});
	}

	[].forEach.call(document.querySelectorAll('#order-area > div'),function (e,index) {
		if(e.dataset['updateYn']==="1" || index !== parseInt(e.dataset['order'])){
			let orderObject ;
			let [type, title, detail, presenter] = e.querySelectorAll('.text');
			orderObject = {
				'worshipId' : document.getElementById('selectWorshipId').value ,
				'id' : e.id,
				'order' : index,
				'type' : type.dataset['value'],
				'title' : title.textContent.trim(),
				'detail' : detail.textContent.trim(),
				'presenter' : presenter.textContent.trim()
			};
			console.log(orderObject);
			orderObject['id'] < 0 ? addOrderList.push(orderObject) : orderList.push(orderObject);
		}
	});

	[].forEach.call(document.querySelectorAll('#ad-area > div'), function(e,index) {
		if(e.dataset['updateYn']==="1" || index !== parseInt(e.dataset['order'])){
			let adObject ;
			console.log(e.querySelectorAll('.text'));
			let title = e.querySelectorAll('.text')[1];
			let content = e.querySelectorAll('.text')[2];
			adObject = {
				'worshipId' : document.getElementById('selectWorshipId').value ,
				'id' : e.id,
				'order' : index,
				'title' : title.textContent.trim(),
				'content' : content.textContent.trim(),
			};
			adObject['id'] < 0 ? addAdList.push(adObject) : adList.push(adObject);
		}
	});

	paramObject = {worshipId: document.getElementById('selectWorshipId').value, 
			worshipObject,
			orderList,
			addOrderList,
			removeOrderList,
			adList,
			addAdList,
			removeAdList};
	console.log(JSON.stringify(paramObject));
	
 	$.ajax({
		url : getContextPath()+"/process/update",
		type : "post",
		contentType : "application/json",
		dataType : "text",
		data : JSON.stringify(paramObject),
		success : function() {
			
			console.log("업데이트발생");
			$("#order-area").children().remove();
			$("#ad-area").children().remove();
			getWorshipInfo($("#selectWorshipId").val());
			getWorshipDetailList($("#selectWorshipId").val(), "order");
			getWorshipDetailList($("#selectWorshipId").val(), "ad");
			alert("수정되었습니다.")
		},

		error : function(XHR, status, error) {
			console.error(status + " : " + error);
		}
	});
	
});

//
// $("#updateButton").on("click", function() {
// 	console.log("클릭");
// 	worshipForm = $("#worshipForm").serialize();
// 	orderForm = $("#orderForm").serialize();
// 	adForm = $("#adForm").serialize();
//
// 	paramObject = {
// 		removeOrderList : removeOrderList,
// 		removeAdList : removeAdList,
// 		worship : worshipForm,
// 		order : orderForm,
// 		ad : adForm
// 	}
//
// 	console.log(paramObject);
//
// 	$.ajax({
// 		url : getContextPath()+"/updateWorship",
// 		type : "post",
// 		contentType : "application/json",
// 		dataType : "text",
// 		data : JSON.stringify(paramObject),
// 		success : function() {
//
// 			console.log("업데이트발생");
// 			console.log($("#selectWorshipId"));
// 			$("#orderList").children().remove();
// 			$("#adList").children().remove();
// 			getWorshipInfo($("#selectWorshipId").val());
// 			getWorshipDetailList($("#selectWorshipId").val(), "order");
// 			getWorshipDetailList($("#selectWorshipId").val(), "ad");
// 			alert("수정되었습니다.")
// 		},
//
// 		error : function(XHR, status, error) {
// 			console.error(status + " : " + error);
// 		}
// 	});
//
// });
//
//

function updateWorshipInit() {
	/* 예배ID 리스트 비동기식으로 조회 */
	$.ajax({
		url : getContextPath()+"/getWorshipIdList",
		type : "post",
		contentType : "application/json",
		data : "admin",
		dataType : "json",
		success : function(worshipIdList) {
			$("#selectWorshipId").children().remove();
			for (var i = 0; i < worshipIdList.length; i++) {
				$("#selectWorshipId").prepend(
						"<option>" + worshipIdList[i] + "</option>")
			}
			if (worshipIdList.length > 0) {
				getWorshipInfo(worshipIdList[0]);
				$("#selectWorshipId option:eq("+(worshipIdList.length-1)+")").attr('selected','selected');
				getWorshipDetailList(worshipIdList[0], "order");
				getWorshipDetailList(worshipIdList[0], "ad");
			}
		},
		error : function(XHR, status, error) {
			console.error(status + " : " + error);
		}
	});

}

function getWorshipInfo(worshipId) {
	console.log("함수 시작");
	console.log(worshipId);
	return new Promise(function(resolve, reject) {
		$.ajax({
			url : getContextPath()+"/getWorshipInfo",
			type : "post",
			contentType : "application/json",
			data : worshipId,
			dataType : "json",
			success : function(data) {
				console.log(data);
				resolve(data);
			},
			error : function(err) {
				reject("에러ㅎㅎㅎ");
			}
		})
	}).then(function(vo) {
		$("[name=worshipDate]").val(vo.worshipDate);
		$("[name=mainPresenter]").val(vo.mainPresenter);
		$("[name=nextPresenter]").val(vo.nextPresenter);
		$("[name=nextPrayer]").val(vo.nextPrayer);
		$("[name=nextOffer]").val(vo.nextOffer);
	});
}

/* value : li에 들어갈 VO, 
 *getType : order / ad 
 */
function getWorshipDetailList(value, getType) {
	var area;
	var urlOption;
	if (getType === "order") {
		area = "#order-area";
		urlOption = "getWorshipOrderList";
	} else if (getType === "ad") {
		area = "#ad-area";
		urlOption = "getWorshipAdList";
	}
	;

	return new Promise(function(resolve, reject) {
		$.ajax({
			url : getContextPath()+"/" + urlOption,
			type : "post",
			contentType : "application/json",
			data : value,
			dataType : "json",
			success : function(data) {
				resolve(data);
			},
			error : function(err) {
				reject();
			}
		})
	}).then(function(vo) {
		for (var j = 0; j < vo.length; j++) {
			var html = templateFactory(getType, vo[j]);
			render(area, html, "append")
		}
		var rowList = document.querySelectorAll('.row');
		[].forEach.call(rowList, addHandlers)
		console.log("rowList", rowList);
	});
}

/* 예배ID 변경시 순서 재호출 */
$("#selectWorshipId").change(function() {
	console.log("변경발생");
	$("#order-area").children().remove();
	$("#ad-area").children().remove();
	getWorshipInfo($(this).val());
	getWorshipDetailList($(this).val(), "order");
	getWorshipDetailList($(this).val(), "ad");

});

$("#deleteWorship").on("click", function() {

	$.ajax({
		url : getContextPath()+"/deleteWorship",
		type : "post",
		contentType : "application/json",
		dataType : "text",
		data : $("#selectWorshipId").val(),
		success : function() {

			$("#orderList").children().remove();
			$("#adList").children().remove();
			updateWorshipInit();
			init();
			alert("삭제되었습니다.");
		},

		error : function(XHR, status, error) {
			console.error(status + " : " + error);
		}
	});

})

	$(document).ready(function() {

		updateWorshipInit();
		
		init();
	});

/* 예배ID 변경시 순서 재호출 */
// $("#updateButton").on("click", function() {
// 	console.log("클릭");
// 	worshipForm = $("#worshipForm").serialize();
// 	orderForm = $("#orderForm").serialize();
// 	adForm = $("#adForm").serialize();
//
// 	paramObject = {
// 		removeOrderList : removeOrderList,
// 		removeAdList : removeAdList,
// 		worship : worshipForm,
// 		order : orderForm,
// 		ad : adForm
// 	}
//
// 	console.log(paramObject);
//
// 	$.ajax({
// 		url : getContextPath()+"/updateWorship",
// 		type : "post",
// 		contentType : "application/json",
// 		dataType : "text",
// 		data : JSON.stringify(paramObject),
// 		success : function() {
//
// 			console.log("업데이트발생");
// 			console.log($("#selectWorshipId"));
// 			$("#orderList").children().remove();
// 			$("#adList").children().remove();
// 			getWorshipInfo($("#selectWorshipId").val());
// 			getWorshipDetailList($("#selectWorshipId").val(), "order");
// 			getWorshipDetailList($("#selectWorshipId").val(), "ad");
// 			alert("수정되었습니다.")
// 		},
//
// 		error : function(XHR, status, error) {
// 			console.error(status + " : " + error);
// 		}
// 	});
//
// });