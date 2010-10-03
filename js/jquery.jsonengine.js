(function($){

	 var je ={
		 baseURI : '/_je/',


		 /*
		  je.get('bbs','XYWMGOUXVBCNZXL');
		  je.get({
		     uri : 'bbs',
		     docId : 'XYWMGOUXVBCNZXL',
		     sort : '_createdAt.asc,
		  


		  });


		  je.get('bbs').sort('_createdAt','asc')
		               .callback(function(data){
		                   //hogehoge
		               });
		 */
		 get : function(){

		 },


		 /*
		  je.post('bbs',{title:titleData, detail:detailData, response:responseData},'eventName');

		  */
		 post : function(){
			 


		 },

		 put : function(){

		 },


		 /*
		  je.delete('bbs');
		  je.delete('bbs','XYWMGOUXVBCNZXL');
		 
		 */
		 delete : function(docType, docId){
			 
			 URI = je.baseURI;
			 if(docType){
				 URI += docType;
			 }
			 if(docId){
				 URI += docId;
			 }

			 $.ajax({
				 type: "DELETE",
				 url: URI,
				 success: {}
			 });

		 }

	 };


})(jQuery);
