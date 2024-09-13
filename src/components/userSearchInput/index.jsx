import { useCallback, useState } from "react";
import { useTranslation } from "@/presentation/i18n/client";
import styles from "./styles.module.css";

const useHover = (styleOnHover, styleOnNotHover = {}) => {
  const [style, setStyle] = useState(styleOnNotHover);
  const onMouseEnter = () => setStyle(styleOnHover);
  const onMouseLeave = () => setStyle(styleOnNotHover);
  return { style, onMouseEnter, onMouseLeave };
};

const Hoverable = ({ children, index, onClick, user }) => {
  const hover = useHover({ backgroundColor: "lightgray" });
  return (
    <div
      className={index % 2 === 0 ? styles.zebra1 : styles.zebra2}
      onClick={(e) => onClick(e, user)}
      {...hover}
    >
      {children}
    </div>
  );
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
    if (suggestedUsers.length > 0) {
      setTimeout(() => setSuggestedUsers([]), 400);
    }
  }, [suggestedUsers, setSuggestedUsers]);

  const onClick = useCallback(
    (e, user) => {
      onUserSelected(user.id);
      setSuggestedUsers([]);
      e.currentTarget.blur();
      setInputValue("");
    },
    [onUserSelected]
  );

  return (
    <div className={styles.languageSelectorContainer}>
      <input
        type="text"
        placeholder={t("searchUserTemplate")}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        value={inputValue}
      />
      {inputValue != "" && suggestedUsers.length == 0 && (
        <div>
          <p className={styles.suggestionItem}>{t("userNotFound")}</p>
        </div>
      )}
      {suggestedUsers.length > 0 && (
        <div className={styles.suggestionContainer}>
          {suggestedUsers.length > 0 &&
            suggestedUsers.map((user, index) => (
              <Hoverable
                key={user.id}
                index={index}
                onClick={onClick}
                user={user}
              >
                <p className={styles.suggestionItem}>
                  {user.name} - {user.email}
                </p>
              </Hoverable>
            ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchInput;
