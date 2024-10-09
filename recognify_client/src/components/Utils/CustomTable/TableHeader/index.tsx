interface tableHeaderType {
  onAddClick: () => void;
  onExportClick: () => void;
  title?: string;
  AddButtonText?: string;
  ExportButtonText?: string;
  disable?: string[];
  recall?: () => void;
}

import { setRecallApi } from "@/redux/reducer/RecallApi";
import { TfiReload } from "react-icons/tfi";
import { useDispatch } from "react-redux";

const FIRST_BUTTON = "FIRST_BUTTON",
  SECOND_BUTTON = "SECOND_BUTTON",
  RELOAD_BUTTON = "RELOAD_BUTTON";

export { FIRST_BUTTON, SECOND_BUTTON, RELOAD_BUTTON };

const TableHeader: React.FC<tableHeaderType> = ({
  onAddClick,
  onExportClick,
  title = "users",
  AddButtonText = "Add New Record",
  ExportButtonText = "Export CSV",
  disable = [],
  recall,
}) => {
  const dispatch = useDispatch();
  return (
    <div>
      <div className="card-header flex-column flex-md-row d-flex justify-content-between align-items-center">
        <h4 className="col-md-6 mb-2 mb-md-0">{title}</h4>
        <div className="dt-action-buttons">
          <div className="dt-buttons">
            {disable.indexOf(FIRST_BUTTON) == -1 ? (
              <button
                className="dt-button buttons-collection dropdown-toggle btn btn-label-primary me-2"
                type="button"
                aria-haspopup="dialog"
                aria-expanded="false"
                onClick={onExportClick}
              >
                <span>
                  <i className="bx bx-export me-sm-1"></i>
                  <span className=" d-sm-inline-block">{ExportButtonText}</span>
                </span>
                <span className="dt-down-arrow"></span>
              </button>
            ) : null}
            {disable.indexOf(SECOND_BUTTON) == -1 ? (
              <button
                className="dt-button create-new btn btn-primary"
                aria-controls="DataTables_Table_0"
                type="button"
                onClick={onAddClick}
              >
                <span>
                  <i className="bx bx-plus me-sm-1"></i>
                  <span className=" d-sm-inline-block">{AddButtonText}</span>
                </span>
              </button>
            ) : null}
            {disable.indexOf(RELOAD_BUTTON) == -1 ? (
              <button
                className="ms-1 refresh_Button"
                aria-controls="DataTables_Table_0"
                type="button"
                onClick={() => {
                  dispatch(setRecallApi(true));
                  if (recall) {
                    recall();
                  }
                }}
              >
                <span>
                  <i className="bx bx-plus me-sm-1"></i>
                  <span className="d-sm-inline-block">
                    <TfiReload />
                  </span>
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
