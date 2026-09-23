# Household Planning
I want to expand this project to allow more people to add their record collections without them adding them to ours. That means that I need to add some way to do groups. For the time being, I am going to call them "Households"

## New Routes?
I want the current routes to work exactly how they are currently working, but with options to change that. Like currently, `/vinyls` shows the user their vinyl collection (their household collection if that is the option they have turned on).

- `/household` - CRUD operations for the household?
- `/household/{id}` - Information about the household, if public?
- `/household/{id}/{vinyls|locations|wanted|plays}` - The tables related to that specific household
- `/household/{id}/{vinyls|locations|wanted|plays}/{targetId}`- Shows info about that specific item
- `/me` - Operations for your user profile
- `/profile/{id}` - Information about a user, if their profile is public?
- `/profile/{id}/{vinyls|locations|wanted|plays}` - The tables related to that specific user?
- `/profile/{id}/{vinyls|locations|wanted|plays}/{targetId}`- Shows info about that specific item

The difficult thing for the `targetID` stuff is that ID is likely going to be the one I normally use, but I will have to do additional checks to make sure the person can see it. Which is going to be true for the default routes too.

**TODO** - There's going to need to be an enhancement to insure that routes verify that they have access to the data. I will need to investigate the best way to do this. I'm cautious about having the front end do it because the data would still be sent to the end user, even if it is for a fraction of a second.

## Household CRUD operations
The first things are the routes
- `/household` - Lets you see information about your household.
	- If you are an owner or editor of a household, you will have the ability to update details about the household. Specifically the following areas:
		- Edit the name of the Household
		- Add/Remove members (view pending requests?)
		- Delete the household
		- Set visibility of a household
			- This is going to be interesting. Like the idea to share your collection with other people can depend on the visibility of the household and its users. Does the visibility of the household overwrite the visibility of the users?
	- If you are not an owner/editor
		- You have the ability to view the information about the household
		- You can also choose to remove yourself from a household
		- There should be a mechanism to request to be added to a household?
	- 

## User Options
- `/me` - The deeper settings page related to the user's profile
- The user should have the ability to edit the following aspects about their profile
	- Visibility - Whether or not their collection is visible to other users
	- Display Name
	- Households
		- They should be able to see the households they are in and be able to remove themselves from them

## New Settings on the user profile
- The original routes should work exactly as they do now. 
	- This means that there needs to be a setting that the user can change to allow them to view only their collection vs the household's collection

