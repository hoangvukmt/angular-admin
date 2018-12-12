// ag-grid-enterprise v18.1.1
import { IContextMenuFactory, RowNode, Column } from "ag-grid";
export declare class ContextMenuFactory implements IContextMenuFactory {
    private context;
    private popupService;
    private gridOptionsWrapper;
    private rowModel;
    private activeMenu;
    private init();
    hideActiveMenu(): void;
    private getMenuItems(node, column, value);
    showMenu(node: RowNode, column: Column, value: any, mouseEvent: MouseEvent | Touch): void;
}
