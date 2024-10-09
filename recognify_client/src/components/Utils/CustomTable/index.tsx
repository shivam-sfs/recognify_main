import ActionFeature from "@/Api/ActionFeature";
import React from "react";
import Switch from "react-switch";
import {FaTrash, FaEdit} from "react-icons/fa";
import {PAGE_TYPE_EDIT} from "../constants";

interface TableComponentCustomProps {
  tableCustomize: CustomTable[];
  data: any[];
  StartIndex?: number;
}
export const EDIT = "Edit",
  DELETE = "Delete";

const CustomTable: React.FC<TableComponentCustomProps> = ({
  tableCustomize = [],
  data = [],
  StartIndex = 1,
}) => {
  return (
    <div className="table-responsive text-nowrap overflow-auto table__main__container">
      <table className="table bg-glass">
        <thead className="table-light">
          <tr key={Math.random()}>
            {tableCustomize.map((item, index) => {
              let classNameTh = "table__text";
              if (item.component) {
                classNameTh = "";
              }
              if (item.key === "created_at") {
                classNameTh = "table__text";
              }
              return (
                <th className={`${classNameTh}`} key={index} scope="col">
                  {item.value}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="table-border-bottom-0">
          {data && data.length > 0 ? (
            data.map((value: any, index: number) => {
              return (
                <tr key={index + Math.random()}>
                  {tableCustomize.map((Row: CustomTable, idex: number) => {
                    if (Row.key && !Row.component) {
                      return (
                        <td
                          className={`table__text ${Row.className}`}
                          key={idex}
                        >
                          {value[Row.key] ? value[Row.key] : "NA"}
                        </td>
                      );
                    } else {
                      if (Row.index) {
                        return (
                          <td
                            className={`table__text ps-1 ${Row.className}`}
                            key={index}
                          >
                            {index + StartIndex}
                          </td>
                        );
                      } else if (Row.component) {
                        let classNameTd = "";
                        if (Row.key === "created_at") {
                          classNameTd = "table__text";
                        }
                        return (
                          <td key={idex} className={`${classNameTd} ${Row.className} table__text_com`}>
                            {Row.component
                              ? Row.component({data: value})
                              : "null"}
                          </td>
                        );
                      }
                    }
                  })}
                </tr>
              );
            })
          ) : (
            <tr key={Math.random()}>
              <td
                colSpan={tableCustomize.length || 1}
                rowSpan={5}
                style={{
                  textAlign: "center",
                  verticalAlign: "middle",
                  fontSize: "larger",
                  marginBottom: "20px",
                }}
              >
                <h4 className="pb-5" style={{marginTop: "150px"}}>
                  No record found!
                </h4>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const ActionSwitch: React.FC<{
  data: any;
  url?: string;
  keyData?: string;
}> = ({data, url, keyData}) => {

  return (
    <Switch
      onChange={() => ActionFeature.toggle(data?._id || 0, data, url, keyData)}
      checked={data?.[keyData || "is_active"] || false}
      uncheckedIcon={false}
      checkedIcon={false}
      onColor="#009EFB"
      offColor="#dcdcdc"
      className="status-switch"
    />
  )
};
const ActionButtons: React.FC<{
  data: any;
  setSelected: React.Dispatch<any>;
  setEdit: React.Dispatch<string>;
  id: string | number;
  disable?: string[];
}> = ({data, setSelected, setEdit, id, disable = []}) => {
  return (
    <>
      {disable.indexOf(EDIT) == -1 ? (
        <>
          <button
            onClick={() => {
              setSelected(data);
              setEdit(PAGE_TYPE_EDIT);
            }}
            className="btn"
            data-tooltip="Edit"
          >
            <FaEdit size={16} />
          </button>
          &nbsp;
        </>
      ) : null}

      {disable.indexOf(DELETE) == -1 ? (
        <button
          onClick={() => ActionFeature.delete(id)}
          className="btn"
          data-tooltip="Delete"
        >
          <FaTrash size={16} />
        </button>
      ) : null}
    </>
  );
};

export {ActionSwitch, ActionButtons};
export default CustomTable;
