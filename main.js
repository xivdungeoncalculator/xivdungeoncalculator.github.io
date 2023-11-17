nbp = 0;
$(document).ready( async function() {
   await $.ajax("https://xivapi.com/InstanceContent")
      .done(function(data) {
         nbp = data.Pagination.PageTotal;
      })

   await $(".dropdown-item").on("click", function(){
      for (let index = 1; index <= nbp; index++) {
         $("#dropdownMenuButton").html($(this).html())
         $("#liste").html(" ");
         UpdateList(index, $(this).attr('id'));
      }
   });

   await $(".list-group").on("click", ".list-group-item", function() {

      CalculateExperience($(this).attr('id'));
   });
   await $(".list-group").on("mouseover", ".list-group-item", function() {
      $(this).addClass("active");
   });
   await $(".list-group").on("mouseout", ".list-group-item", function() {
      $(this).removeClass("active");
   });
   await $('#card2 .btn').on('click', function() {
      if ($(this).hasClass("btn-primary")) {
         UpdateExp($(this).attr('id'),'divide');
         $(this).removeClass('btn-primary');
         $(this).addClass('btn-secondary');
      }
      else {
         UpdateExp($(this).attr('id'),'multiply');
         $(this).removeClass('btn-secondary');
         $(this).addClass('btn-primary');
      }
   });
})

function UpdateExp(modifier, charge) {
   value = parseInt( $('#exp').html() );
   firstvalue = parseInt( $('#firstexp').html() );
   switch (modifier) {
      case "wellrested":
         multiply = 2.5;
         break;
      case "wellfed":
         multiply = 1.03;
         break;
      case "ring":
         multiply = 1.3;
         break;
      case "menphina":
         multiply = 1.3;
         break;
      case "friendship":
         multiply = 1.2;
         break;
      case "squadron":
         multiply = 1.15;
         break;
      case "lessthan70":
         multiply = 2;
         break;
      case "lessthan90":
         multiply = 1.5;
         break;
      case "mentorbonus":
         multiply = 1.2;
         break;
      default:
         break;
   }
   switch (charge) {
      case "divide":
         if (modifier == 'firstclear') {
            $('#exp').html(value - firstvalue);
         }
         else {
            $('#exp').html(Math.round(value/multiply));
         }
         break;
      case "multiply":
         if (modifier == 'firstclear') {
            $('#exp').html(value + firstvalue);
         }
         else {
            $('#exp').html(Math.round(value*multiply));
         }
         break;
      default:
         break;
   }
}
function GetNbPages(x) {
   nbp = x;
}

function UpdateList(page,type) {
   temp = 'https://xivapi.com/InstanceContent?page=' + page;
      $.ajax({
         url: temp,
         success: function success(data) {
         data.Results.forEach(element => {
            if (element.Name && element.Icon == type) {
               $("#liste").append("<a href=\"#\"><li id=" + element.ID + " class=\"list-group-item ripple\">" + element.Name + "</li></a>");
            }
         });
      },
      error: function fail(xhr) {
         alert("An error occured: " + xhr.status + " " + xhr.statusText);
      }
      });
}

function CalculateExperience(id) {
   temp = 'https://xivapi.com/InstanceContent/' + id;
   $.ajax({
      url: temp,
      success: function success(data) {
         exp = 0;
         if (data.BossExp0) 
         {
            exp += 2
         }
         if (data.BossExp1) {
            exp += data.BossExp1;
         }
         if (data.BossExp2) {
            exp += data.BossExp2;
         }
         if (data.BossExp3) {
            exp += data.BossExp3;
         }
         if (data.BossExp4) {
            exp += data.BossExp4;
         }
         if (data.FinalBossExp) {
            exp += data.FinalBossExp;
         }

         $("#result-body").html(
            "<div id=\"result-div\"> \
               <img class=\"img-fluid\" src=\"https://www.xivapi.com" + data.Banner +"\" alt=\"Dungeon Banner\">\
               <div class=\"result-values\">"+ data.Name +"</div>\
               <div class=\" result-text\"> gives </div>\
               <div id =\"exp\" class=\"result-values\"> "+ exp + " </div>\
               <div class=\"result-values\"> experience points</div>\
               <div class=\" result-text\">excluding roulette bonuses\</div>\
               <div id=\"firstexp\" hidden>"+ data.InstanceClearExp +"</div>\
            </div>"
         );

   },
   error: function fail(xhr) {
      alert("An error occured: " + xhr.status + " " + xhr.statusText);
   }
   });
}

