define(['models/questions/question', 'guard', 'eventManager', 'eventDataBuilders/questionEventDataBuilder'],
    function (Question, guard, eventManager, eventDataBuilder) {
        "use strict";

        function Hotspot(spec) {
            var _protected = {
                getProgress: getProgress,
                restoreProgress: restoreProgress,

                submit: submitAnswer
            };

            Question.call(this, spec, _protected);

            this.background = spec.background;
            this.spots = spec.spots;
            this.isMultiple = spec.isMultiple;
            this.placedMarks = [];
        };

        return Hotspot;

        function submitAnswer(marks) {
            guard.throwIfNotArray(marks, 'Marks is not array.');

            this.isAnswered = true;
            this.placedMarks = _.map(marks, function (mark) { return { x: mark.x, y: mark.y }; });

            var scores = calculateScore(this.isMultiple, this.spots, this.placedMarks);

            this.score(scores);
            this.isCorrectAnswered = scores == 100;

            eventManager.answersSubmitted(
                eventDataBuilder.buildHotspotQuestionSubmittedEventData(this)
            );
        };

        function calculateScore(isMultiple, spots, placedMarks) {
            if (!_.isArray(spots) || spots.length == 0) {
                return placedMarks.length ? 0 : 100;
            }

            var answerCorrect;
            if (!isMultiple) {
                answerCorrect = _.some(spots, function (spot) {
                    return _.some(placedMarks, function (mark) {
                        return markIsInSpot(mark, spot);
                    });
                });
            } else {
                var spotsWithMarks = [];
                var marksOnSpots = [];

                _.each(placedMarks, function (mark) {
                    _.each(spots, function (spot) {
                        if (markIsInSpot(mark, spot)) {
                            spotsWithMarks.push(spot);
                            marksOnSpots.push(mark);
                        }
                    });
                });

                answerCorrect = _.uniq(spotsWithMarks).length === spots.length && _.uniq(marksOnSpots).length === placedMarks.length;
            }

            return answerCorrect ? 100 : 0;
        }

        function markIsInSpot(mark, spot) {
            var x = mark.x, y = mark.y;

            var inside = false;
            for (var i = 0, j = spot.length - 1; i < spot.length; j = i++) {
                var xi = spot[i].x, yi = spot[i].y;
                var xj = spot[j].x, yj = spot[j].y;

                var intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }

            return inside;
        };

        function getProgress() {
            return this.placedMarks;
        }

        function restoreProgress(progress) {
            var that = this;
            _.each(progress, function (mark) {
                that.placedMarks.push(mark);
            });
            
            this.score(calculateScore(that.isMultiple, that.spots, that.placedMarks));
        }
    });