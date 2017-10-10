# Project 2 #

Users can search for gyms in any area and find other people that follow the same gym. The purpose of this app is to encourage people to network with other people that go to the same gym as them. Users can also write reviews for gyms, which are viewable on each gym's info page.

#### User Stories ####
* Mr. Potato Head, a 36 year old inactive male, wants to find a gym near him with good reviews
* Jessica, a 23 year old runner, just moved to Seattle and wants to find a gym buddy near her that has a similar schedule
* Walter, a 45 year old business man, travels frequently and needs to find quality gyms in a variety of cities

#### Planning ####

![Alt text](Wireframes/Home.png)
![Alt text](Wireframes/results.png)
![Alt text](Wireframes/gyminfo.png)

#### Routes ####

Method | URL | Purpose
------ | --- | -------
POST | /search | return a list of gyms based on search query
GET | /profile | return the logged-in user's profile
GET | /users | show all users
GET | /users/:id | render info page for specific user
POST | /users/:id/schedule | posts form data to user's schedule
DELETE | /users/:id/schedule/:id | deletes schedule entry
GET | /users/:id/schedule/:id/edit | renders edit form for schedule entry
PUT | /users/:id/schedule/:id | updates schedule entry
GET | /following | renders page of gyms that logged-in user is following
POST | /following | finds or adds gym to user's following list
DELETE | /following/:id | removes relationship between user and gym (unfollow)
GET | /following/:id | renders gym info page
POST | /following/:id/reviews | creates gym review from form data

#### Tech Used ####
* HTML
* CSS
* JavaScript
* Node/Express
* Google Places API

#### Credits ####
* community.jpg retrieved from "https://communitysharesmke.org/wp-content/uploads/2015/12/community1.jpg"
* gym.jpg retrieved from "http://www.harrogatesfc.co.uk/wp-content/uploads/2015/11/12208762_995467120517853_7018141057947368028_n.jpg"

#### Next Steps ####
* add friend feature so users can connect with one another
* add user preferences such as lifting, running, etc. so that users can find other people with similar interests
* add more profile customization (profile pic, bio)