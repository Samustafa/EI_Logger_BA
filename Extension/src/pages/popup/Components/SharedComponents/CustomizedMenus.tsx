import * as React from 'react';
import {Dispatch, SetStateAction} from 'react';
import {alpha, styled} from '@mui/material/styles';
import Menu, {MenuProps} from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {buttonStyle} from "@pages/popup/Consts/Styles";
import {ArrowDownIcon} from "@pages/popup/svg/ArrowDownIcon";
import {Button} from "@mui/material";

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({theme}) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

interface Props {
    sex: "male" | "female" | "diverse" | "sex",
    setSex: Dispatch<SetStateAction<"male" | "female" | "diverse" | "sex">>,
    error: boolean
}

export default function CustomizedMenus({sex, setSex, error}: Props) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function setMale() {
        setSex("male")
        handleClose()
    }

    function setFemale() {
        setSex("female")
        handleClose()
    }

    function setDiverse() {
        setSex("diverse")
        handleClose()
    }

    return (
        <div>
            <Button
                id="sex-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                color={error ? "error" : "primary"}
                className={buttonStyle}
            >
                <ArrowDownIcon text={sex}/>
            </Button>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{'aria-labelledby': 'demo-customized-button'}}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={setMale} disableRipple>{"male"}</MenuItem>
                <MenuItem onClick={setFemale} disableRipple>{"female"}</MenuItem>
                <MenuItem onClick={setDiverse} disableRipple>{"diverse"}</MenuItem>
            </StyledMenu>
        </div>
    );
}
