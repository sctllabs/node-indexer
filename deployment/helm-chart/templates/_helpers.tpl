{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "node-indexer.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "node-indexer.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "node-indexer.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "node-indexer.labels" -}}
helm.sh/chart: {{ include "node-indexer.chart" . }}
{{ include "node-indexer.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Selector labels
*/}}
{{- define "node-indexer.selectorLabels" -}}
app.kubernetes.io/name: {{ include "node-indexer.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "node-indexer.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "node-indexer.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the processor deployment.
*/}}
{{- define "processor.name" -}}
{{- default .Chart.Name .Values.processor.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "processor.fullname" -}}
{{- if .Values.processor.fullnameOverride -}}
{{- .Values.processor.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.processor.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "processor.labels" -}}
helm.sh/chart: {{ include "node-indexer.chart" . }}
{{ include "processor.selectorLabels" . }}
app.kubernetes.io/component: processor
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Selector labels
*/}}
{{- define "processor.selectorLabels" -}}
app.kubernetes.io/name: {{ include "processor.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "processor.serviceAccountName" -}}
{{- if .Values.processor.serviceAccount.create -}}
    {{ default (include "processor.fullname" .) .Values.processor.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.processor.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the query node deployment.
*/}}
{{- define "queryNode.name" -}}
{{- default .Chart.Name .Values.queryNode.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "queryNode.fullname" -}}
{{- if .Values.queryNode.fullnameOverride -}}
{{- .Values.queryNode.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.queryNode.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "queryNode.labels" -}}
helm.sh/chart: {{ include "node-indexer.chart" . }}
{{ include "queryNode.selectorLabels" . }}
app.kubernetes.io/component: query-node
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Selector labels
*/}}
{{- define "queryNode.selectorLabels" -}}
app.kubernetes.io/name: {{ include "queryNode.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "queryNode.serviceAccountName" -}}
{{- if .Values.queryNode.serviceAccount.create -}}
    {{ default (include "queryNode.fullname" .) .Values.queryNode.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.queryNode.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the archive ingest deployment.
*/}}
{{- define "archiveIngest.name" -}}
{{- default .Chart.Name .Values.archiveIngest.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "archiveIngest.fullname" -}}
{{- if .Values.archiveIngest.fullnameOverride -}}
{{- .Values.archiveIngest.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.archiveIngest.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "archiveIngest.labels" -}}
helm.sh/chart: {{ include "node-indexer.chart" . }}
{{ include "archiveIngest.selectorLabels" . }}
app.kubernetes.io/component: archive-ingest
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Selector labels
*/}}
{{- define "archiveIngest.selectorLabels" -}}
app.kubernetes.io/name: {{ include "archiveIngest.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "archiveIngest.serviceAccountName" -}}
{{- if .Values.archiveIngest.serviceAccount.create -}}
    {{ default (include "archiveIngest.fullname" .) .Values.archiveIngest.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.archiveIngest.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the archive gateway deployment.
*/}}
{{- define "archiveGateway.name" -}}
{{- default .Chart.Name .Values.archiveGateway.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "archiveGateway.fullname" -}}
{{- if .Values.archiveGateway.fullnameOverride -}}
{{- .Values.archiveGateway.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.archiveGateway.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "archiveGateway.labels" -}}
helm.sh/chart: {{ include "node-indexer.chart" . }}
{{ include "archiveGateway.selectorLabels" . }}
app.kubernetes.io/component: archive-gateway
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Selector labels
*/}}
{{- define "archiveGateway.selectorLabels" -}}
app.kubernetes.io/name: {{ include "archiveGateway.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "archiveGateway.serviceAccountName" -}}
{{- if .Values.archiveGateway.serviceAccount.create -}}
    {{ default (include "archiveGateway.fullname" .) .Values.archiveGateway.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.archiveGateway.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the archive explorer deployment.
*/}}
{{- define "archiveExplorer.name" -}}
{{- default .Chart.Name .Values.archiveExplorer.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "archiveExplorer.fullname" -}}
{{- if .Values.archiveExplorer.fullnameOverride -}}
{{- .Values.archiveExplorer.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.archiveExplorer.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "archiveExplorer.labels" -}}
helm.sh/chart: {{ include "node-indexer.chart" . }}
{{ include "archiveExplorer.selectorLabels" . }}
app.kubernetes.io/component: archive-explorer
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Selector labels
*/}}
{{- define "archiveExplorer.selectorLabels" -}}
app.kubernetes.io/name: {{ include "archiveExplorer.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "archiveExplorer.serviceAccountName" -}}
{{- if .Values.archiveExplorer.serviceAccount.create -}}
    {{ default (include "archiveExplorer.fullname" .) .Values.archiveExplorer.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.archiveExplorer.serviceAccount.name }}
{{- end -}}
{{- end -}}
