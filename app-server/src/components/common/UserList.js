import UserListItem from "./UserListItem";

function UserList(props) {
  console.log(props.userItems);
  var userArr = props.userItems.map((item, index) => (
    <UserListItem key={index} item={item} handleToggle={props.handleToggle} />
  ));

  return <div className="cart-list">{userArr}</div>;
}

export default UserList;
