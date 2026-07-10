"use client";

import { useGetTransactionAuditLogs, formatTransactionAuditLog, getFieldChanges } from "@/services/audit-logs.service";
import { 
  Loader2, 
  History, 
  User, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Eye, 
  FileText,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib";
import { useState } from "react";
import Link from "next/link";

interface TransactionAuditLogsProps {
  transactionId: string;
  businessId: string;
  cashbookId: string;
  transactionType: 'cash_in' | 'cash_out';
  transactionAmount: number;
}

export function TransactionAuditLogs({
  transactionId,
  businessId,
  cashbookId,
  transactionType,
  transactionAmount
}: TransactionAuditLogsProps) {
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<string[]>([]);
  
  const {
    transactionAuditLogs,
    isTransactionAuditLogsPending,
    isTransactionAuditLogsError,
    transactionAuditLogsError,
    refetchTransactionAuditLogs,
  } = useGetTransactionAuditLogs(transactionId);

  const toggleLogExpansion = (logId: string) => {
    setExpandedLogs(prev => 
      prev.includes(logId) 
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  if (isTransactionAuditLogsPending) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-5 h-5 animate-spin text-primary mr-2" />
        <span className="text-sm text-gray-500">Loading audit trail...</span>
      </div>
    );
  }

  if (isTransactionAuditLogsError) {
    return (
      <div className="p-4 text-center border rounded-lg bg-red-50">
        <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
        <p className="text-sm text-red-600">Failed to load audit logs</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchTransactionAuditLogs()}
          className="mt-2 h-8"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!transactionAuditLogs.length) {
    return (
      <div className="p-4 text-center border rounded-lg bg-gray-50">
        <Activity className="w-6 h-6 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">No audit history available</p>
      </div>
    );
  }

  const logsToShow = showAllLogs ? transactionAuditLogs : transactionAuditLogs.slice(0, 1);
  const latestLog = transactionAuditLogs[0];
  const formattedLatestLog = latestLog ? formatTransactionAuditLog(latestLog) : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-semibold text-gray-900">Audit Trail</h3>
          <Badge variant="secondary" className="ml-2">
            {transactionAuditLogs.length} events
          </Badge>
        </div>
        
        <Link
          href={`/dashboard/business/${businessId}/${cashbookId}/audit-logs?transaction=${transactionId}`}
          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
        >
          View full history
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Latest Activity Summary */}
      {formattedLatestLog && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${formattedLatestLog.changeTypeInfo.bgColor}`}>
              {formattedLatestLog.changeTypeInfo.icon === 'plus' && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {formattedLatestLog.changeTypeInfo.icon === 'edit' && (
                <FileText className="w-5 h-5 text-blue-600" />
              )}
              {formattedLatestLog.changeTypeInfo.icon === 'trash' && (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {formattedLatestLog.changedBy.name}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`${formattedLatestLog.changeTypeInfo.bgColor} ${formattedLatestLog.changeTypeInfo.textColor} border-current`}
                  >
                    {formattedLatestLog.changeTypeInfo.label}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">
                  {formattedLatestLog.relativeTime}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                {formattedLatestLog.changeReason}
              </p>
              
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {formattedLatestLog.changedBy.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formattedLatestLog.formattedDate}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formattedLatestLog.formattedTime}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Timeline */}
      <div className="space-y-3">
        {logsToShow.map((log, index) => {
          const formattedLog = formatTransactionAuditLog(log);
          const changes = getFieldChanges(log);
          const isExpanded = expandedLogs.includes(log._id);
          const isFirst = index === 0;
          
          return (
            <div key={log._id} className={`border rounded-lg overflow-hidden ${isFirst ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'}`}>
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleLogExpansion(log._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${formattedLog.changeTypeInfo.bgColor}`}>
                      {formattedLog.changeTypeInfo.icon === 'plus' && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {formattedLog.changeTypeInfo.icon === 'edit' && (
                        <FileText className="w-4 h-4 text-blue-600" />
                      )}
                      {formattedLog.changeTypeInfo.icon === 'trash' && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {log.changedBy.name}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${formattedLog.changeTypeInfo.bgColor} ${formattedLog.changeTypeInfo.textColor} border-current`}
                        >
                          {formattedLog.changeTypeInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {log.changeReason}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formattedLog.formattedDate}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formattedLog.formattedTime}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t p-4 bg-white">
                  {/* Changed By Details */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Changed By</h4>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white rounded-full">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{log.changedBy.name}</p>
                        <p className="text-sm text-gray-500">{log.changedBy.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Field Changes */}
                  {changes.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Field Changes</h4>
                      <div className="space-y-2">
                        {changes.map((change, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                {change.fieldLabel}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {change.field}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <span className="text-xs text-gray-500">Before</span>
                                <div className="bg-red-50 p-2 rounded border border-red-100">
                                  <span className={`text-sm ${change.oldValue ? 'text-red-700' : 'text-gray-500'}`}>
                                    {change.field === 'amount' 
                                      ? formatCurrency(change.oldValue)
                                      : String(change.oldValue || 'Empty')
                                    }
                                  </span>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <span className="text-xs text-gray-500">After</span>
                                <div className="bg-green-50 p-2 rounded border border-green-100">
                                  <span className={`text-sm ${change.newValue ? 'text-green-700' : 'text-gray-500'}`}>
                                    {change.field === 'amount'
                                      ? formatCurrency(change.newValue)
                                      : String(change.newValue || 'Empty')
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Log Metadata */}
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Metadata</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Log ID:</span>
                        <p className="font-mono text-xs truncate" title={log._id}>
                          {log._id.substring(0, 12)}...
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Transaction ID:</span>
                        <p className="font-mono text-xs truncate" title={String(log.transaction)}>
                          {String(log.transaction).substring(0, 12)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {transactionAuditLogs.length > 1 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowAllLogs(!showAllLogs)}
        >
          {showAllLogs ? (
            <>
              Show Less
              <ChevronUp className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Show {transactionAuditLogs.length - 1} More Events
              <ChevronDown className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      )}

      {/* Summary Stats */}
      {/* <div className="grid grid-cols-4 gap-2">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-700">
            {transactionAuditLogs.filter(l => l.changeType === 'create').length}
          </div>
          <div className="text-xs text-green-600">Created</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-700">
            {transactionAuditLogs.filter(l => l.changeType === 'update').length}
          </div>
          <div className="text-xs text-blue-600">Updated</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-700">
            {transactionAuditLogs.filter(l => l.changeType === 'delete').length}
          </div>
          <div className="text-xs text-red-600">Deleted</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-gray-700">
            {transactionAuditLogs.length}
          </div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
      </div> */}
    </div>
  );
}