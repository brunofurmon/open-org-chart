import { useCallback, useState } from "react";
import { useTranslation } from "@/presentation/i18n/client";

const useHover = (styleOnHover, styleOnNotHover = {}) => {
  const [style, setStyle] = useState(styleOnNotHover);
  const onMouseEnter = () => setStyle(styleOnHover);
  const onMouseLeave = () => setStyle(styleOnNotHover);
  return { style, onMouseEnter, onMouseLeave };
};

const Hoverable = ({ children }) => {
  const hover = useHover({ backgroundColor: "lightgray" });
  return <div {...hover}>{children}</div>;
};

const UserSearchInput = ({ users, onUserSelected }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const { t } = useTranslation("orgchart");
  const [inputValue, setInputValue] = useState("");

  const filterUsers = useCallback(
    (input) => {
      const filteredUsers = users
        .filter(
          (user) =>
            user.name.toLowerCase().includes(input.toLowerCase()) ||
            user.email.toLowerCase().includes(input.toLowerCase())
        )
        .slice(0, 5);
      setSuggestedUsers(filteredUsers);
    },
    [users]
  );

  const onChange = useCallback(
    (e) => {
      const input = e.target.value;
      setInputValue(input);

      if (input === "") {
        setSuggestedUsers([]);
        return;
      }

      filterUsers(input);
    },
    [filterUsers]
  );

  const onFocus = useCallback(() => {
    if (inputValue !== "") {
      filterUsers(inputValue);
    }
  }, [filterUsers, inputValue]);

  const onBlur = useCallback(() => {
    setTimeout(() => {
      setSuggestedUsers([]);
    }, 100);
  }, [setSuggestedUsers]);

  const onClick = useCallback(
    (user) => {
      console.log(user);
      onUserSelected(user.id);
    },
    [onUserSelected]
  );

  return (
    <>
      <input
        type="text"
        placeholder={t("searchUserTemplate")}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        value={inputValue}
      />
      {users.length > 0 && (
        <div
          style={{
            backgroundColor: "white",
            borderWidth: "1px",
            borderColor: "black",
            borderStyle: "solid",
          }}
        >
          {suggestedUsers.length > 0 &&
            suggestedUsers.map((user) => (
              <Hoverable key={user.id}>
                <p onClick={() => onClick(user)}>
                  {user.name} - {user.email}
                </p>
              </Hoverable>
            ))}
        </div>
      )}
    </>
  );
};

export default UserSearchInput;
