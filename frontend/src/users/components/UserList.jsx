import UserItem from "./UserItem";
import "./UserList.css";
const UserList = ({items}) => {
  if (items.length === 0) {
    return (
      <div className="center">
        <h2>No User found.</h2>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {items.map((user) => (
        <UserItem
          key={user._id}
          id={user._id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};
export default UserList;
