// Utility functions for date handling
export const formatDateForContract = (dateString) => {
     const date = new Date(dateString);
     // Set the time to end of day (23:59:59) for the deadline
     date.setHours(23, 59, 59, 999);
     return Math.floor(date.getTime() / 1000);
   };
   
   export const getMinDate = () => {
     const today = new Date();
     return today.toISOString().split('T')[0];
   };
   
   export const formatDateFromUnix = (unixTimestamp) => {
     const date = new Date(unixTimestamp * 1000);
     const day = date.getDate();
     const monthNames = [
       "Jan", "Feb", "Mar", "Apr", "May", "Jun",
       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
     ];
     const month = monthNames[date.getMonth()];
     const year = date.getFullYear();
     return `${day} ${month} ${year}`;
   };
   
   export const isExpired = (unixTimestamp) => {
     return Date.now() / 1000 >= unixTimestamp;
   };
   