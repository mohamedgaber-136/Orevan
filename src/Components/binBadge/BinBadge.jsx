import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
export const BinBadge = () => {
  const navigate = useNavigate();
  function notificationsLabel(count) {
    if (count === 0) {
      return "no notifications";
    }
    if (count > 99) {
      return "more than 99 notifications";
    }
    return `${count} notifications`;
  }
  return (
    <IconButton
      // aria-label={notificationsLabel("1")}
      aria-label={"1"}
      onClick={() => navigate("/app/DeletedData")}
    >
      <Badge
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        // badgeContent={"1"}
        badgeContent={""}
        color=""
        title={""}
      >
        <DeleteOutlineIcon />
      </Badge>
    </IconButton>
  );
};
