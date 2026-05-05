# Table Rewrite
I want to get away from using the MaterialUI Data Table and migrate the project to use [React-Table](https://tanstack.com/table/latest) by the people who made React Query.

## Functionality that I need to consider this done

 - [ ] The ability to sort the columns based on what is stored in the user's settings.
 - [ ] The ability to filter data
   - The filter settings should be stored either in the URL or somewhere else so that the user can reload the page and get that same data back. It is incredibly annoying to click into an item on the list only to lose the filtering
 - [ ] Multi-column filtering
	- Currently with the free version of Data Table, you're only allowed to filter by 
 - [ ] Show/Hide Columns and have this sync to the settings
 - [ ] Rearrange the column order and have this sync to the settings.
 - [ ] Export the data
	 - It can be only to CSV, but it is important for the user to have complete control over their data.

## Nice to Haves
- [ ] Multi-editing - The ability to quickly edit multiple objects would be nice.
