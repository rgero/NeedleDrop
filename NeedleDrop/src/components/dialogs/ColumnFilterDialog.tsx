import { useEffect, useMemo, useState } from "react";
import { alpha, Box, Button, Chip, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Fade, IconButton, Menu, MenuItem, Paper, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { DragHandle, ExpandLess, ExpandMore, MoreVert } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import TagIcon from "@mui/icons-material/Tag";
import NumbersIcon from "@mui/icons-material/Numbers";
import EventIcon from "@mui/icons-material/Event";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ListAltIcon from "@mui/icons-material/ListAlt";
import type { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";

import { useDialogProvider } from "@context/dialog/DialogContext";
import { useUserContext } from "@context/users/UserContext";
import { DefaultSettings } from "@interfaces/settings/DefaultSettings";
import type { FilterLayout } from "@interfaces/settings/UserSettings";
import { normalizeColumnOrder } from "@utils/normalizeColumnOrder";
import { type BooleanFilterValue, type ColumnFilterDraft, type ColumnFilterDraftMap, type DateFilterOperator, type FilterableColumnOption, type NumberFilterOperator, type TextFilterOperator, getFilterableColumnOptions, isFilterDraftActive, parseColumnFilterDraftMapFromSearchParams, writeColumnFilterDraftMapToSearchParams} from "@components/ui/tables/urlColumnFilters";
import { datePartKeys, getDateFilterError, getDatePartsError, type DateParts } from "@components/ui/tables/dateColumnFilters";

const monthLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const ColumnFilterDialog = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchParams, setSearchParams] = useSearchParams();
  const { columnFilterDialogOpen, columnFilterDialogConfig, closeColumnFilterDialog } = useDialogProvider();
  const [draftFilterMap, setDraftFilterMap] = useState<ColumnFilterDraftMap>({});
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const { getCurrentUserSettings, updateCurrentUserSettings } = useUserContext();

  const columns = columnFilterDialogConfig?.columns ?? [];
  const settingsColumn = columnFilterDialogConfig?.settingsColumn;

  const filterOptions = useMemo(() => {
    const options = getFilterableColumnOptions(columns as ColumnDef<unknown, any>[]);
    return options.filter((option) => {
      const matchingColumn = columns.find((col) => col.id === option.id);
      return !matchingColumn?.meta?.disableFilter;
    });
  }, [columns]);

  const layout = settingsColumn ? getCurrentUserSettings()?.tableFilterLayouts?.[settingsColumn] : undefined;
  const defaultOrder = filterOptions.map((option) => option.id);
  const currentOrder = normalizeColumnOrder(layout?.order ?? [], defaultOrder);
  const optionsById = new Map(filterOptions.map((option) => [option.id, option]));
  const orderedFilterOptions = currentOrder.flatMap((id) => {
    const option = optionsById.get(id);
    return option ? [option] : [];
  });

  const saveLayout = (updates: Partial<FilterLayout>) => {
    if (!settingsColumn) return;
    const layouts = getCurrentUserSettings()?.tableFilterLayouts;
    updateCurrentUserSettings({
      tableFilterLayouts: {
        ...DefaultSettings.tableFilterLayouts,
        ...layouts,
        [settingsColumn]: {
          order: currentOrder,
          collapsed: layout?.collapsed ?? [],
          ...layouts?.[settingsColumn],
          ...updates,
        },
      },
    });
  };

  const handleReorder = ({ source, destination }: DropResult) => {
    if (!destination || source.index === destination.index) return;
    const order = [...currentOrder];
    const [moved] = order.splice(source.index, 1);
    order.splice(destination.index, 0, moved);
    saveLayout({ order });
  };

  const handleClose = () => {
    setMenuAnchor(null);
    closeColumnFilterDialog();
  };

  const activeFilterMap = useMemo(
    () => parseColumnFilterDraftMapFromSearchParams(searchParams, filterOptions),
    [searchParams, filterOptions],
  );

  useEffect(() => {
    if (columnFilterDialogOpen) {
      setDraftFilterMap(activeFilterMap);
    }
  }, [activeFilterMap, columnFilterDialogOpen]);

  const hasInvalidDateFilter = filterOptions.some((option) => {
    const draft = draftFilterMap[option.id] ?? activeFilterMap[option.id];
    return draft?.variant === "date" && getDateFilterError(draft) !== null;
  });

  const handleApply = () => {
    if (hasInvalidDateFilter) {
      return;
    }
    const nextParams = writeColumnFilterDraftMapToSearchParams(searchParams, draftFilterMap);
    setSearchParams(nextParams, { replace: true });
    handleClose();
  };

  const handleReset = () => {
    const nextParams = writeColumnFilterDraftMapToSearchParams(searchParams, {});
    setSearchParams(nextParams, { replace: true });
    setDraftFilterMap({});
  };

  const activeFilterCount = Object.values(activeFilterMap).filter((draft) => isFilterDraftActive(draft)).length;

  const updateDraft = (columnId: string, updater: (draft: ColumnFilterDraft) => ColumnFilterDraft) => {
    setDraftFilterMap((previous) => {
      const current = previous[columnId] ?? activeFilterMap[columnId];
      if (!current) {
        return previous;
      }

      return {
        ...previous,
        [columnId]: updater(current),
      };
    });
  };

  const getVariantIcon = (variant: ColumnFilterDraft["variant"]) => {
    if (variant === "number") {
      return <NumbersIcon fontSize="small" />;
    }

    if (variant === "date") {
      return <EventIcon fontSize="small" />;
    }

    if (variant === "boolean") {
      return <ToggleOnIcon fontSize="small" />;
    }

    if (variant === "select") {
      return <ListAltIcon fontSize="small" />;
    }

    return <TagIcon fontSize="small" />;
  };

  const renderFilterInput = (option: FilterableColumnOption) => {
    const draft = draftFilterMap[option.id] ?? activeFilterMap[option.id];
    if (!draft) {
      return null;
    }

    if (draft.variant === "number") {
      return (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
          <TextField
            select
            label="Condition"
            value={draft.operator}
            size="small"
            sx={{ minWidth: 170 }}
            onChange={(event) => {
              const nextOperator = event.target.value as NumberFilterOperator;
              updateDraft(option.id, (current) => {
                if (current.variant !== "number") {
                  return current;
                }

                return {
                  ...current,
                  operator: nextOperator,
                };
              });
            }}
          >
            <MenuItem value="gt">Greater Than</MenuItem>
            <MenuItem value="lt">Less Than</MenuItem>
            <MenuItem value="eq">Equal To</MenuItem>
          </TextField>
          <TextField
            label="Value"
            type="number"
            value={draft.value}
            size="small"
            fullWidth
            onChange={(event) => {
              updateDraft(option.id, (current) => {
                if (current.variant !== "number") {
                  return current;
                }

                return {
                  ...current,
                  value: event.target.value,
                };
              });
            }}
          />
        </Stack>
      );
    }

    if (draft.variant === "date") {
      const error = getDateFilterError(draft);
      const renderDateParts = (field: "value" | "from" | "to") => {
        const parts = draft[field];
        const prefix = field === "value" ? "" : field === "from" ? "From " : "To ";
        const updatePart = (part: keyof DateParts, value: string) => {
          updateDraft(option.id, (current) => current.variant === "date"
            ? { ...current, [field]: { ...current[field], [part]: value } }
            : current);
        };
        const monthValue = parts.month.trim() ? String(Number(parts.month)) : "";
        const validMonth = /^\d+$/.test(parts.month.trim()) && Number(parts.month) >= 1 && Number(parts.month) <= 12;
        const partsError = getDatePartsError(parts) !== null;

        return (
          <Stack spacing={0.75} role="group" aria-label={`${option.label} ${field}`}>
            {field !== "value" ? <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>{field === "from" ? "From" : "To"}</Typography> : null}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 0.75fr)",
                gap: 1.25,
                px: 1.25,
                py: 1,
                border: "1px solid",
                borderColor: partsError ? "error.main" : "divider",
                borderRadius: 1,
                bgcolor: "background.paper",
                "&:focus-within": { borderColor: partsError ? "error.main" : "primary.main" },
              }}
            >
            {datePartKeys.map((part) => (
              <TextField
                key={part}
                id={`${option.id}-${field}-${part}`}
                label={`${part[0].toUpperCase()}${part.slice(1)}`}
                variant="standard"
                select={part === "month"}
                type={part === "month" ? undefined : "number"}
                size="small"
                value={part === "month" ? (validMonth ? monthValue : parts.month) : parts[part]}
                error={partsError}
                onChange={(event) => updatePart(part, event.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: { disableUnderline: true },
                  htmlInput: part === "month" ? undefined : { min: 1, max: part === "year" ? 9999 : 31, step: 1, inputMode: "numeric", "aria-label": `${prefix}${part === "year" ? "Year" : "Day"}` },
                  select: part === "month" ? {
                    SelectDisplayProps: { "aria-label": `${prefix}Month`, "aria-labelledby": undefined },
                    renderValue: (value) => {
                      const label = monthLabels[Number(value) - 1];
                      return label ? (isMobile ? label.slice(0, 3) : label) : "";
                    },
                  } : undefined,
                }}
                sx={{
                  minWidth: 0,
                  position: "relative",
                  "&:not(:first-child)::before": {
                    content: '""',
                    position: "absolute",
                    left: theme.spacing(-0.625),
                    top: 4,
                    bottom: 4,
                    borderLeft: "1px solid",
                    borderColor: "divider",
                    pointerEvents: "none",
                  },
                  "& input[type=number]": { appearance: "textfield", MozAppearance: "textfield" },
                  "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": { WebkitAppearance: "none", margin: 0 },
                }}
                fullWidth
              >
                {part === "month" ? [
                  <MenuItem key="any" value="">Any</MenuItem>,
                  ...monthLabels.map((label, index) => <MenuItem key={label} value={String(index + 1)}>{label}</MenuItem>),
                  ...(!validMonth && parts.month ? [<MenuItem key="invalid" value={parts.month} disabled>Invalid month</MenuItem>] : []),
                ] : null}
              </TextField>
            ))}
            </Box>
          </Stack>
        );
      };

      return (
        <Stack spacing={1.25}>
          <TextField
            select
            label="Condition"
            value={draft.operator}
            size="small"
            sx={{ width: { xs: "100%", sm: 170 } }}
            onChange={(event) => {
              const nextOperator = event.target.value as DateFilterOperator;
              updateDraft(option.id, (current) => {
                if (current.variant !== "date") {
                  return current;
                }

                return {
                  ...current,
                  operator: nextOperator,
                };
              });
            }}
          >
            <MenuItem value="eq">Equals</MenuItem>
            <MenuItem value="after">After</MenuItem>
            <MenuItem value="before">Before</MenuItem>
            <MenuItem value="between">Between</MenuItem>
          </TextField>

          {draft.operator === "between" ? (
            <Stack spacing={1.5} divider={<Divider />}>
              {renderDateParts("from")}
              {renderDateParts("to")}
            </Stack>
          ) : renderDateParts("value")}
          {error ? <Typography role="alert" color="error" variant="caption">{error}</Typography> : null}
        </Stack>
      );
    }

    if (draft.variant === "boolean") {
      return (
        <TextField
          select
          label="Value"
          value={draft.value}
          size="small"
          fullWidth
          onChange={(event) => {
            const nextValue = event.target.value as BooleanFilterValue;
            updateDraft(option.id, (current) => {
              if (current.variant !== "boolean") {
                return current;
              }

              return {
                ...current,
                value: nextValue,
              };
            });
          }}
        >
          <MenuItem value="">Any</MenuItem>
          <MenuItem value="true">Yes</MenuItem>
          <MenuItem value="false">No</MenuItem>
        </TextField>
      );
    }

    if (draft.variant === "select") {
      return (
        <TextField
          select
          label="Value"
          value={draft.value}
          size="small"
          fullWidth
          onChange={(event) => {
            updateDraft(option.id, (current) => {
              if (current.variant !== "select") {
                return current;
              }

              return {
                ...current,
                value: event.target.value,
              };
            });
          }}
        >
          <MenuItem value="">Any</MenuItem>
          {option.options.map((value) => (
            <MenuItem key={value} value={value}>{value}</MenuItem>
          ))}
        </TextField>
      );
    }

    return (
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
        <TextField
          select
          label="Condition"
          value={draft.operator}
          size="small"
          sx={{ minWidth: 170 }}
          onChange={(event) => {
            const nextOperator = event.target.value as TextFilterOperator;
            updateDraft(option.id, (current) => {
              if (current.variant !== "text") {
                return current;
              }

              return {
                ...current,
                operator: nextOperator,
              };
            });
          }}
        >
          <MenuItem value="includes">Includes</MenuItem>
          <MenuItem value="excludes">Does not include</MenuItem>
        </TextField>
        <TextField
          label="Value"
          value={draft.value}
          onChange={(event) => {
            updateDraft(option.id, (current) => {
              if (current.variant !== "text") {
                return current;
              }

              return {
                ...current,
                value: event.target.value,
              };
            });
          }}
          fullWidth
          size="small"
        />
      </Stack>
    );
  };

  if (!columnFilterDialogConfig) {
    return null;
  }

  return (
    <Dialog
      fullScreen={isMobile}
      open={columnFilterDialogOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slots={{ transition: Fade }}
      slotProps={{ paper: { sx: { overflow: "hidden" } } }}
      transitionDuration={{ enter: 300, exit: 200 }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
          <SearchIcon fontSize="small" />
          <Typography variant="h6" component="span" sx={{ flex: 1 }}>Column Filters</Typography>
          {activeFilterCount > 0 ? <Chip size="small" color="primary" label={`${activeFilterCount} active`} /> : null}
          <IconButton
            aria-label="Filter layout options"
            aria-controls={menuAnchor ? "filter-layout-menu" : undefined}
            aria-haspopup="menu"
            aria-expanded={Boolean(menuAnchor)}
            onClick={(event) => setMenuAnchor(event.currentTarget)}
          >
            <MoreVert />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Menu id="filter-layout-menu" anchorEl={menuAnchor} open={columnFilterDialogOpen && Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => { saveLayout({ order: defaultOrder }); setMenuAnchor(null); }}>Reset order</MenuItem>
        <MenuItem onClick={() => { saveLayout({ collapsed: [] }); setMenuAnchor(null); }}>Reset visibility</MenuItem>
      </Menu>
      <DialogContent
        dividers
        sx={{
          background: `linear-gradient(160deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.paper, 1)} 45%)`,
        }}
      >
        <DragDropContext onDragEnd={handleReorder}>
          <Droppable droppableId="table-filter-order">
            {(provided) => (
              <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ pt: 0.75 }}>
                {orderedFilterOptions.map((option, index) => {
                  const draft = draftFilterMap[option.id] ?? activeFilterMap[option.id];
                  if (!draft) {
                    return null;
                  }
                  const collapsed = layout?.collapsed?.includes(option.id) ?? false;
                  const error = draft.variant === "date" ? getDateFilterError(draft) : null;

                  return (
                    <Draggable key={option.id} draggableId={option.id} index={index} disableInteractiveElementBlocking>
                      {(draggableProvided, snapshot) => (
                        <Paper
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          variant="outlined"
                          sx={{
                            mb: 1.5,
                            px: 1.5,
                            py: 1.25,
                            borderRadius: 2,
                            boxShadow: snapshot.isDragging ? 3 : 0,
                            borderColor: isFilterDraftActive(draft) ? alpha(theme.palette.primary.main, 0.55) : "divider",
                            backgroundColor: theme.palette.background.paper,
                          }}
                        >
                          <Stack spacing={1.25}>
                            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                              <IconButton size="small" {...draggableProvided.dragHandleProps} aria-label={`Reorder ${option.label}`}>
                                <DragHandle fontSize="small" />
                              </IconButton>
                              <Typography variant="subtitle2" sx={{ flex: 1 }}>{option.label}</Typography>
                              {isFilterDraftActive(draft) ? <Chip size="small" color="primary" label="Active" /> : null}
                              {error ? <Chip size="small" color="error" label="Invalid date" /> : null}
                              <Chip
                                icon={getVariantIcon(draft.variant)}
                                label={draft.variant}
                                size="small"
                                variant="outlined"
                              />
                              <IconButton
                                size="small"
                                aria-label={`${collapsed ? "Expand" : "Collapse"} ${option.label}`}
                                aria-expanded={!collapsed}
                                aria-controls={`filter-input-${option.id}`}
                                onClick={() => saveLayout({
                                  collapsed: collapsed
                                    ? (layout?.collapsed ?? []).filter((id) => id !== option.id)
                                    : [...(layout?.collapsed ?? []), option.id],
                                })}
                              >
                                {collapsed ? <ExpandMore /> : <ExpandLess />}
                              </IconButton>
                            </Stack>
                            <Collapse in={!collapsed} timeout="auto">
                              <Box id={`filter-input-${option.id}`} sx={{ pt: 0.25 }}>{renderFilterInput(option)}</Box>
                            </Collapse>
                          </Stack>
                        </Paper>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset}>Reset</Button>
        <Button onClick={handleApply} variant="contained" disabled={hasInvalidDateFilter}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnFilterDialog;
