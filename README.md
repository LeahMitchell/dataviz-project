# Data Visualization Project

## Data

The data I propose to visualize for my project is the Marvel character dataset. It contains information about the superhero such as gender, race, skin color, eye color, and alignment. There are numeric based power measurements (such as strength, inteligence, or speed) that cumulate into a total score. There is also many specific super powers (stealth, weapons master, or super strength) that are in a binary format for each character.

Gist Link:
https://gist.github.com/LeahMitchell/8ad46fbcac8d7420bcd5b97b1a245f43

## Prototypes

Currently, there are a few in-progress prototypes for this project. 

The most flushed out design thus far is a scatterplot of the numeric power values, sized by the total power value. This visualization also allows used the capabilities to highlight points to determine the character's name and the ability to choose the X and Y axis values. Future iterations of this graph will be the ability to zoom in on the points, the ability to have the graph show you a specific character (highlighting the point based on a drop down menu), and the ability to highlight points under a specific alignment.
VizHub link: https://vizhub.com/LeahMitchell/b2ef2f5b5aaf4e888fabfd979b4a7b80?edit=files&file=index.js

Another visualization that is in progress is a radar graph that will show the relationship of a charaters numeric power values. The visualization at the moment is not well flushed out as it is currently static and more of a "proof of concept". Future iterations will allow users to pick which character they want to see, the color of the graph based on the character's alignment, and possibly the ability to show two characters at the same time. 
VizHub link: https://vizhub.com/LeahMitchell/59f891539dd2413e8806b09bb7a0ae5e

The last prototype is a very simple bar chart of the number of characters for each alignment. Future iterations of this work will include more specifics into the makeup of each bar, for example the gender or race breakdown of each bar. 
Vizhub link: https://vizhub.com/LeahMitchell/8b04fa1b1f9d467d9c79152421120b17

## Questions & Tasks

The following tasks and questions will drive the visualization and interaction decisions for this project:

 * What numeric or categorical strength is more prevelant across the characters? 
 * Who are the strongest characters (by total numeric strength/powers or by total categorical powers or by both) overall and what is their alignment? 
 * What are some of the general trends across the genders, powers, race against general count of characters per alignment?
 * For each character, what is a general make up of their abilities? 

Other questions that would be nice to answer if extra time: 

* Following up on strongest, what are some of the patterns or characteristics of the strongest or weakest characters?
* Do certain numerical power scores correlate to specific categorical powers?
* What are the various patterns in gender, numeric and categorical powers for teams (i.e. original avengers), partners (i.e. Falcon and Winter Solider), and enemies (i.e. Ironman and Thanos)


## Sketches
Below is an example of my personal favorite 4 sketches from the original assignment, sketched out in a little more detail/color. There are many more visualizations that I would want to create and would love to have a a full page of Marvel vis for fans to geek out over. The end goal would to have all graphs on a github website and strung together to create a narative about Marvel. 

1. This graph is a spider graph to help detail the relationship between numerical power values for a character. The coloring of the graph would be based on the alignment and there would be a info box to the side to help detail a little more about the character. A more advanced goal of this graph would be the ability to layer multiple characters on the same graph or have multiple spider graphs in the same window. 
2. This graph is a interactive scatterplot where users can change the x and y axis to be the various numerical power values. The points would be colored by alignment and character name would appear. (See prototypes)
3. This bar graph would detail the average numerical power values for each categorical power. So, the average values for all characters with a power, such as stealth, would be displayed. There would be around 3 total categorical powers displayed on one plot with drop down menus to choose which powers the user wants to display. Another advanced goal would to have other stats displayed when hovering over the bars. 
4. Lastly, this graph is an example of a more static graph. These pie (or donut) charts would show the proportion of good vs bad character that have a specific categorical power. The size of the pie chart would be based on the total number of characters that have that power. This graph could also benefit from interation 


![image](https://github.com/LeahMitchell/dataviz-project/blob/master/Stealth-1.png)


## Open Questions

Overall, the main concern regarding this project is being able to incorperate all pieces of the vision. While I have been able to learn a lot thus far, I don't believe I am not yet at the skill level to get all pieces working. 

The main goal is currently to get all 4 sketched graphs at minimum with plenty of wiggle room to add more in later. Currently, the scatterplot is at a good point but all other visualizations need a large amount of work. I am not fully able to determine how long each iterations will take me as it sometimes takes me no time to change something and other times I am fully stuck. 

## Schedule

For the schedule, I based everything on a weekly schedule of 'to-do's, so all tasks under one week should take approximately a week to do. 

10/18: (Break) Lightly work on building up current prototypes
* Donut chart needs to be fixed

10/25: Get each visualization to have visual encodings:
 * Donut chart approrpiately sized and colored
 * Bar chart broken down into sub categories
 * Radar chart colored, possibly adding info box

11/1: Add at least one interation per visualization
* Menu and hovering for donut chart
* Menu and hovering for bar chart
* Menu for Radar chart

11/8: Add other visuals if time, otherwise continue to develop images
* Fix any bugs 
* Determine current schedule and add another visualization if ahead

11/15: Continue iterating on work, last week to add new visual
* Make sure all interations are working
* Add other interations for radar, such as two charts at once

11/22: (Thanksgiving week) User feedback on 'final draft' (from family/friends)
* Collect feedback from users to determine if graphs make sense
* Get user experience specifically about interations 


11/29: Github page/website up and running, same general formating across visualizations
* Build up website for final narative of visualizations
* Determine final color scheme, fonts, etc for all visuals  

12/6: Last minute toches/last iterations
* Fix any last minute bugs
* User feedback round 2

12/10 Final Deliverable

## Iterations

10/26: Addressing Project Feedback:

* Restructed radar code to be in seperate js file
* Worked with creating multiple radar graphs on one plot (ultimate goal of showing all characters' radar graphs)
* Colored radar graphs by character side
* Plot character names on scatterplot 

Radar Chart: https://vizhub.com/LeahMitchell/a73e10b87b774375890bb56de2ff7162

![image](https://github.com/LeahMitchell/dataviz-project/blob/master/radar_it_1.PNG)

Scatterplot: https://vizhub.com/LeahMitchell/75c74ab6bd824e34be0feed0e92867fd?file=index.js

![image](https://github.com/LeahMitchell/dataviz-project/blob/master/scatter_it_1.PNG)

