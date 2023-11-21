nbp = 0;
buttonspressed = {}
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
   value = $('#expvalue').html();
   switch (charge) {
      case "divide":
         switch (modifier) {
            case "wellrested":
               buttonspressed.wellrested = 0;
               break;
            case "wellfed":
               buttonspressed.wellfed = 0;
               break;
            case "ring":
               buttonspressed.ring = 0;
               break;
            case "menphina":
               buttonspressed.menphina = 0;
               break;
            case "friendship":
               buttonspressed.friendship = 0;
               break;
            case "squadron":
               buttonspressed.squadron = 0;
               break;
            case "lessthan70":
               buttonspressed.lessthan70 = 0;
               break;
            case "lessthan90":
               buttonspressed.lessthan90 = 0;
               break;
            case "mentorbonus":
               buttonspressed.mentorbonus = 0;
               break;
            default:
               break;
         }
         break;
      case "multiply":
         switch (modifier) {
            case "wellrested":
               buttonspressed.wellrested = 1.5;
               break;
            case "wellfed":
               buttonspressed.wellfed = 0.03
               break;
            case "ring":
               buttonspressed.ring = 0.3;
               break;
            case "menphina":
               buttonspressed.menphina = 0.3;
               break;
            case "friendship":
               buttonspressed.friendship = 0.2;
               break;
            case "squadron":
               buttonspressed.squadron = 0.15;
               break;
            case "lessthan70":
               buttonspressed.lessthan70 = 1;
               break;
            case "lessthan90":
               buttonspressed.lessthan90 = 0.5;
               break;
            case "mentorbonus":
               buttonspressed.mentorbonus = 0.2;
               break;
            default:
               break;
         }
         break;
      default:
         break;
   }
   multiply = 1;
   values = Object.values(buttonspressed);
   for (let index = 0; index < values.length; index++) {
      multiply += values[index];
   }
   $('#exp').html(parseInt(value*multiply));
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
            exp += data.BossExp0;
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
               <div id =\"expvalue\" hidden>" + exp +"</div>\
            </div>"
         );

   },
   error: function fail(xhr) {
      alert("An error occured: " + xhr.status + " " + xhr.statusText);
   }
   });
}

