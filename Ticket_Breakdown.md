# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### User Story
    As a Facility I want custom Agent Ids in the Shifts PDF report.

### Ticket Details

| Title | Description | Acceptance Criteria | Estimation | Implementation Details | Assumption |
|-------|-------------|---------------------|------------|------------------------|------------|
| Create FacilityAgents table | Create a table to store the Facility specific custom ids for all the agents | 1. A table should be generated to store the custom ids. 2. The table should support for all the CRUD(Create/Read/Update/Delete) operations on custom ids |1 Dev working day + QA + Release efforts| Schema details: ```id: integer, facility_id: integer(foreign_key to Facility table), agent_id: integer(foreign_key to Agent table), custom_id: string, created_at: timestamp, created_by: integer(foreign_key to User table), updated_at: timestamp, updated_by: integer(foreign_key to User table), deleted_at: timestamp, delelted_by: integer(foreign_key to User table)```||
| Load the Agent's custom id details to FacilityAgents table | Add the custom id for each agent with respect to the Facilities | 1. Custom IDs for all the agents should be imported to the table for all the facilities |1 - 2 Dev working day + QA + Release efforts| Create a function `importFacilityAgentsData` which accepts facility level custom ids and import the data to the table| All the Facility data are available |
| Include the Agent's custom id in the ShiftsByFacility data | Update the `getShiftsByFacility` function to query the FacilityAgents table to get the custom id and include the data in the returning list | 1. Custom ID of agents with specific to a Facility should be included the list |1 Dev Working Day + QA + Release efforts| Update the data structure to include the `agent_custom_id` attribute ||
| Include the Agent's custom id in the facility report | Add a new field in the PDF report to include the custom id of agents with specific to a Facility | Agent's custom id should be included in the Facility Shifts detail report|1 Dev Working Day + QA + Release efforts| Update the PDF constructor to include agent_custom_id details ||
