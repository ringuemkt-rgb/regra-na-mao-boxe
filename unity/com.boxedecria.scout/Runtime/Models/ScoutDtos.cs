using System;
using System.Collections.Generic;

namespace BoxeDeCria.Scout
{
    [Serializable]
    public sealed class ScoutDossierDto
    {
        public string id;
        public string slug;
        public string status;
        public string sport;
        public string name;
        public string nickname;
        public string category;
        public string team;
        public string photoUrl;
        public IdentityDto identity = new();
        public RecordDto record = new();
        public List<ScoutTimelineItemDto> timeline = new();
        public List<ScoutFightDto> fights = new();
        public List<ScoutMetricDto> metrics = new();
        public List<ScoutTechnicalSectionDto> technicalSections = new();
        public List<ScoutMediaContextDto> mediaContext = new();
        public List<ScoutClaimDto> claims = new();
        public List<ScoutSourceDto> sources = new();
        public string verdict;
        public string lastUpdatedAt;
    }

    [Serializable] public sealed class IdentityDto
    {
        public string birthDate;
        public int age;
        public string birthPlace;
        public string nationality;
        public string stance;
        public float heightCm;
        public float reachCm;
        public string coach;
    }

    [Serializable] public sealed class RecordDto
    {
        public int wins;
        public int losses;
        public int draws;
        public int noContests;
    }

    [Serializable] public sealed class ScoutFightDto
    {
        public string id;
        public string date;
        public string @event;
        public string opponent;
        public string result;
        public string method;
        public int round;
        public string time;
        public List<string> sourceIds = new();
        public string opponentStyle;
        public bool titleFight;
        public int knockdownsSuffered;
        public int takedownsAttemptedAgainst;
        public int takedownsDefended;
        public string round1Result;
    }

    [Serializable] public sealed class ScoutTimelineItemDto
    {
        public int year;
        public string date;
        public string title;
        public string description;
        public List<string> claimIds = new();
    }

    [Serializable] public sealed class ScoutMetricDto
    {
        public string key;
        public string label;
        public float value;
        public string unit;
        public string derivation;
        public List<string> sourceIds = new();
        public float confidence;
        public int sampleSize;
        public List<string> limitations = new();
    }

    [Serializable] public sealed class ScoutTechnicalSectionDto
    {
        public string key;
        public string title;
        public string summary;
        public List<string> claimIds = new();
    }

    [Serializable] public sealed class ScoutMediaContextDto
    {
        public string title;
        public string publisher;
        public string date;
        public string url;
        public string sourceId;
    }

    [Serializable] public sealed class ScoutClaimDto
    {
        public string id;
        public string text;
        public string status;
        public float confidence;
        public List<ScoutEvidenceDto> evidence = new();
    }

    [Serializable] public sealed class ScoutEvidenceDto
    {
        public string sourceId;
        public string field;
        public string excerpt;
        public float timestampSeconds;
    }

    [Serializable] public sealed class ScoutSourceDto
    {
        public string id;
        public string kind;
        public string title;
        public string publisher;
        public string url;
        public string retrievedAt;
        public float reliability;
    }

    [Serializable] public sealed class ScoutDossierListResponse { public List<ScoutDossierDto> items = new(); }
}
