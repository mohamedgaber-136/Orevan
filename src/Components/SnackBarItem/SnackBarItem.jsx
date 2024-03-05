import React from "react";
import { useSnackbar } from "@mui/base/useSnackbar";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { css, keyframes, styled } from "@mui/system";
import styles from "./SnackBarItem.module.css";
import { useEffect } from "react";

export default function SnackBarItem({ snackBarConfig, setSnackBarConfig }) {
  const handleClose = () => {
    setSnackBarConfig({ open: false });
  };
  const { getRootProps, onClickAway } = useSnackbar({
    onClose: handleClose,
    open: snackBarConfig.open,
    autoHideDuration: 5000,
  });

  return (
    <React.Fragment>
      {snackBarConfig.open ? (
        <ClickAwayListener onClickAway={onClickAway}>
          <div {...getRootProps()} className={styles.snackBar}>
            {snackBarConfig.message}
          </div>
        </ClickAwayListener>
      ) : null}
    </React.Fragment>
  );
}
