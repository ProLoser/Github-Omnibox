(function () {
    StepManager.loadPatterns({
        my: {
            children: {
                issues: {
                    suggest: suggestOwnRoad,
                    decide: "dashboard/issues"
                },
                dash: {
                    suggest: suggestOwnRoad,
                    decide: ""
                },
                pulls: {
                    suggest: suggestOwnRoad,
                    decide: "dashboard/pulls"
                },
                stars: {
                    suggest: suggestOwnRoad,
                    decide: "stars"
                },
                starred: {
                    suggest: suggestOwnRoad,
                    decide: "stars"
                },
                settings: {
                    suggest: suggestOwnRoad,
                    decide: "dashboard/settings"
                },
                followers: {
                    suggest: suggestOwnRoad,
                    decide: decideWithUser("/followers")
                },
                following: {
                    suggest: suggestOwnRoad,
                    decide: decideWithUser("/following")
                },
                repositories: {
                    suggest: suggestOwnRoad,
                    decide: decideWithUser("?tab=repositories")
                },
                activities: {
                    suggest: suggestOwnRoad,
                    decide: decideWithUser("?tab=activity")
                },

                auth: {
                    suggest: suggestOwnRoad,
                    decide: function () {
                        omni.authorize();
                        alert("You can unauthorize at any time by doing \"gh my unauth\"");
                        return false;
                    }
                },
                unauth: {
                    suggest: suggestOwnRoad,
                    decide: function () {
                        omni.unauthorize();
                        alert('You can authorize at any time by doing "gh my auth"');
                        return false;
                    }
                },
                reset: {
                    suggest: suggestOwnRoad,
                    decide: function () {
                        omni.reset();
                        alert('Cache has been reset'); // TODO reset or clear?
                        return false;
                    }
                }
            }
        }
    });

    //suggest's the step's road
    function suggestOwnRoad() {
        return {
            content: this.getRoad(),
            description: this.getRoad()
        };
    }

    function decideWithUser(url) {
        return function () {
            return omni.user + url;
        }
    }

}());