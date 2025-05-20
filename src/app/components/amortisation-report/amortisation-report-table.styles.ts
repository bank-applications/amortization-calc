const NONE = 'none';
const WHITE_COLOR = '#FFFFFF'

export const tableStyles = {
  root: {
    header: {
      background: NONE,
      color: WHITE_COLOR,
      borderWidth: '0px',
      cell: {
        background: NONE,
        color: WHITE_COLOR,
        border: {
          color: `${WHITE_COLOR}29`,
        },
        hover: {
          background: NONE,
          color: `${WHITE_COLOR}99`
        }
      }
    },
    body:{
      cell: {
        border: {
          color: `${WHITE_COLOR}29`
        }
      }
    },
    border: {
      color: WHITE_COLOR
    },
    row: {
      background: NONE,
      color: WHITE_COLOR
    }
  }
}

export const cardStyles = {
  root: {
    background: `${WHITE_COLOR}29`,
    color: WHITE_COLOR
  }
}

export const iconButtonStyles = {
  root: {
    primary: {
      color: WHITE_COLOR
    }
  }
}
